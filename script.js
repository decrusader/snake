const gameBoard = document.getElementById("gameBoard");
let highscore = getCookie("highscore");

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

document.querySelector("#highscore").innerHTML = highscore;

// Game variables
let snake = [{ x: 200, y: 200 }];
let direction = "UP";
let food = { x: 0, y: 0 };
let stone = { x: 0, y: 0 };
let stone2 = { x: 0, y: 0 };
let score = 0;
let gamerunning = true;

// Create the initial food position

createStone2();
createStone();
createFood();

// Game loop
setInterval(update, 250);
document.getElementById("game_over").innerHTML = "reset";
document.querySelector("#game_over").addEventListener('click', reset);

document.addEventListener("keydown", changeDirection);

function reset() {
    document.location.reload();
}

// Game over check
function update() {
    if (gamerunning) {
        if (checkCollision()) {
            if (highscore < score) {
                highscore = score;
                setCookie("highscore", score, 360);
                document.querySelector("#highscore").innerHTML = highscore;
            }
            document.querySelector("#game_over").innerHTML = "game over";
            gamerunning = false;
        }
        moveSnake();
        if (snake[0].x === food.x && snake[0].y === food.y) {
            score++;
            createFood();
            createStone();
            createStone2();
        } else {
            snake.pop();
        }
        render();
    }
}

// Controls snake movement speed
function moveSnake() {
    const head = { ...snake[0] };
    switch (direction) {
        case "LEFT":
            head.x -= 20;
            break;
        case "UP":
            head.y -= 20;
            break;
        case "RIGHT":
            head.x += 20;
            break;
        case "DOWN":
            head.y += 20;
            break;
    }
    snake.unshift(head);
}

// Controls the snake movement direction
function changeDirection(event) {
    const keyPressed = event.keyCode;
    switch (keyPressed) {
        case 37:
            if (direction !== "RIGHT") direction = "LEFT";
            break;
        case 38:
            if (direction !== "DOWN") direction = "UP";
            break;
        case 39:
            if (direction !== "LEFT") direction = "RIGHT";
            break;
        case 40:
            if (direction !== "UP") direction = "DOWN";
            break;
    }
}

function up() {
    if (direction !== "DOWN" || snake.length === 1) direction = "UP";
}

function down() {
    if (direction !== "UP" || snake.length === 1) direction = "DOWN";
}

function left() {
    if (direction !== "RIGHT" || snake.length === 1) direction = "LEFT";
}

function right() {
    if (direction !== "LEFT" || snake.length === 1) direction = "RIGHT";
}

document.querySelector("#UP").addEventListener("click", up);
document.querySelector("#DOWN").addEventListener("click", down);
document.querySelector("#LEFT").addEventListener("click", left);
document.querySelector("#RIGHT").addEventListener("click", right);

// Create the initial food position
function createFood() {
    nx = Math.floor(Math.random() * 18 + 1) * 20;
    ny = Math.floor(Math.random() * 18 + 1) * 20;
    console.log("food", nx, ny);
    for (let i = 0; i < snake.length; i++) {
        piece = snake[i];

        if (nx === piece.x && ny === piece.y) {
            createFood();
            return;
        }
    }
    if (nx === stone.x && ny === stone.y) {
        createFood();
        return;
    }
    food.x = nx;
    food.y = ny;
    document.querySelector("#score").innerHTML = `Score: ${score}`;
}

function createStone() {
    nx = Math.floor(Math.random() * 18 + 1) * 20;
    ny = Math.floor(Math.random() * 18 + 1) * 20;
    console.log("stone", nx, ny);
    for (let i = 0; i < snake.length; i++) {
        piece = snake[i];
        if (nx === piece.x && ny === piece.y) {
            createStone();
            return;
        }

    }
    if (nx === food.x && ny === food.y) {
        createStone();
        return;
    }
    stone.x = nx;
    stone.y = ny;
}

function createStone2() {
    nx = Math.floor(Math.random() * 18 + 1) * 20;
    ny = Math.floor(Math.random() * 18 + 1) * 20;
    console.log("stone2", nx, ny);
    for (let i = 0; i < snake.length; i++) {
        piece = snake[i];
        if (nx === piece.x && ny === piece.y) {
            createStone2();
            return;
        }

    }
    if (nx === food.x && ny === food.y) {
        createStone2();
        return;
    }
    stone2.x = nx;
    stone2.y = ny;
}

// Render the game board
function render() {
    gameBoard.innerHTML = '';
    snake.forEach((part, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.left = `${part.x}px`;
        snakeElement.style.top = `${part.y}px`;
        snakeElement.classList.add('snake');
        if (index === 0) {
            snakeElement.classList.add('head'); // Add class for the head
        }
        gameBoard.appendChild(snakeElement);
    });
    const foodElement = document.createElement('div');
    foodElement.style.left = `${food.x}px`;
    foodElement.style.top = `${food.y}px`;
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);

    const stoneElement = document.createElement('div');
    stoneElement.style.left = `${stone.x}px`;
    stoneElement.style.top = `${stone.y}px`;
    stoneElement.classList.add('stone');
    gameBoard.appendChild(stoneElement);

    const stone2Element = document.createElement('div');
    stone2Element.style.left = `${stone2.x}px`;
    stone2Element.style.top = `${stone2.y}px`;
    stone2Element.classList.add('stone');
    gameBoard.appendChild(stone2Element);
}

// Check for collisions
function checkCollision() {
    const head = snake[0];
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) return true;
    }
    if (head.x === stone.x && head.y === stone.y) {
        return true;
    }
    if (head.x === stone2.x && head.y === stone2.y) {
        return true;
    }

    const hitLeftWall = head.x < 0;
    const hitRightWall = head.x >= 400;
    const hitTopWall = head.y < 0;
    const hitBottomWall = head.y >= 400;
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}
