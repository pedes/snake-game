const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


// Constants
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Game State
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 15, y: 15 };
let score = 0;
let lastRenderTime = 0;
let speed = 10; // Initial frames per second
let isPaused = false;

// Utility Functions
function drawRect(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
}

function drawSnake() {
    snake.forEach(segment => drawRect(segment.x, segment.y, 'green'));
}

function drawFood() {
    drawRect(food.x, food.y, 'red');
}

function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        placeFood();
        if (score % 5 === 0) speed += 0.5; // Increase speed every 5 points
    } else {
        snake.pop();
    }
}

function placeFood() {
    let validPosition = false;
    while (!validPosition) {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);
        validPosition = !snake.some(segment => segment.x === food.x && segment.y === food.y);
    }
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function displayGameOver() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Game Over! Your score: ${score}`, canvas.width / 2, canvas.height / 2);
}

function gameLoop(currentTime) {
    if (isPaused) {
        requestAnimationFrame(gameLoop);
        return;
    }

    if ((currentTime - lastRenderTime) < 1000 / speed) {
        requestAnimationFrame(gameLoop);
        return;
    }
    lastRenderTime = currentTime;

    if (checkCollision()) {
        displayGameOver();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    moveSnake();

    requestAnimationFrame(gameLoop);
}

// Event Listeners
document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
        case 'p':
            isPaused = !isPaused;
            break;
    }
});

// Start Game Loop
placeFood();
requestAnimationFrame(gameLoop);