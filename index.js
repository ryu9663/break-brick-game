const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

const ballRadius = 10;

let rightPressed = false;
let leftPressed = false;

let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let bricks = [];

let score = 0;

const drawScore = () => {
  ctx.font = "16px Arial";
  ctx.fillText("Score: " + score, 8, 20);
};

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

const resetBallPosition = () => {
  x = canvas.width / 2;
  y = canvas.height - 30;
};
const gameOver = () => {
  alert("GAME OVER!");
  resetBallPosition();
  document.location.reload();
};

const youWin = () => {
  alert("YOU WIN, CONGRATULATIONS!");
  resetBallPosition();
  document.location.reload();
};

const changeColor = () =>
  (ctx.fillStyle = "#" + Math.round(Math.random() * 0xffffff).toString(16));

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);

        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          changeColor();
          dy = -dy;
          b.status = 0;
          score++;
          if (score == brickRowCount * brickColumnCount) youWin();
        }
      }
    }
  }
}

const speedUp = () => {
  dy += 2;
  dx += 2;
};
const bounceBall = () => {
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX - 1 && x < paddleX + paddleWidth + 1) {
      changeColor();
      dy = -dy - 0.3;
      dx += 0.3;
    } else {
      gameOver();
    }
  }
};

const drawBall = () => {
  bounceBall();
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
};

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);

  ctx.fill();
  ctx.closePath();
}

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();
  drawScore();
  x += dx;
  y += dy;
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
};
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

setInterval(draw, 10);
