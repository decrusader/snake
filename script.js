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
let score = 0;
let gamerunning = true;

// Create the initial food position
createFood();

// Game loop
setInterval(update, 250);
document.getElementById("game_over").innerHTML = "reset";
document.querySelector("#game_over").addEventListener('click', reset)




document.addEventListener("keydown", changeDirection);

function reset() {
    document.location.reload();
}
//game over
function update() {
    if (gamerunning) {

        if (checkCollision()) {
            // document.location.reload();
            if (highscore < score) {
                highscore = score;
                setCookie("highscore", score, 360);
                document.querySelector("#highscore").innerHTML = highscore;
            }
            document.querySelector("#game_over").innerHTML = "game over";
            gamerunning = false;
        }
        // make the snake bigger
        moveSnake();

        if (snake[0].x === food.x && snake[0].y === food.y) {
            score++;
            createFood();
        } else {
            snake.pop();
        }

        render();
    }
}
// controls speed
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
// making you can't do wron directions
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

function up(){
    direction = "UP";
}

function down(){
    direction = "DOWN";
}

function left(){
    direction = "LEFT";
}

function right(){
    direction = "RIGHT";
}

document.querySelector("#UP").addEventListener("click", up);
document.querySelector("#DOWN").addEventListener("click", down);
document.querySelector("#LEFT").addEventListener("click", left);
document.querySelector("#RIGHT").addEventListener("click", right);

// food creation
function createFood() {
    food.x = Math.floor(Math.random() * 20) * 20;
    food.y = Math.floor(Math.random() * 20) * 20;

    console.log(food);

    document.querySelector("#score").innerHTML = score;
}
//render game board
function render() {
    gameBoard.innerHTML = '';

    snake.forEach(part => {
        const snakeElement = document.createElement('div');
        snakeElement.style.left = `${part.x}px`;
        snakeElement.style.top = `${part.y}px`;
        snakeElement.classList.add('snake');
        gameBoard.appendChild(snakeElement);
    });
    //style food
    const foodElement = document.createElement('div');
    foodElement.style.left = `${food.x}px`;
    foodElement.style.top = `${food.y}px`;
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
}
// the collision check
function checkCollision() {
    const head = snake[0];

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) return true;
    }

    const hitLeftWall = head.x < 0;
    const hitRightWall = head.x >= 400;
    const hitTopWall = head.y < 0;
    const hitBottomWall = head.y >= 400;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}
