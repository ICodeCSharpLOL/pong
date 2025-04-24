
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 10;
const paddleHeight = 100;
const paddleSpeed = 6;
const ballSize = 10;

let leftPaddle = {
  x: 0,
  y: canvas.height / 2 - paddleHeight / 2,
};

let rightPaddle = {
  x: canvas.width - paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
};

let ball = {
  x: canvas.width / 2 - ballSize / 2,
  y: canvas.height / 2 - ballSize / 2,
  dx: 4 * (Math.random() > 0.5 ? 1 : -1),
  dy: 4 * (Math.random() > 0.5 ? 1 : -1)
};

let keys = {};

document.addEventListener('keydown', e => {
  keys[e.key] = true;
});

document.addEventListener('keyup', e => {
  keys[e.key] = false;
});

function update() {
  // Move paddles
  if (keys['w'] && leftPaddle.y > 0) leftPaddle.y -= paddleSpeed;
  if (keys['s'] && leftPaddle.y < canvas.height - paddleHeight) leftPaddle.y += paddleSpeed;
  if (keys['ArrowUp'] && rightPaddle.y > 0) rightPaddle.y -= paddleSpeed;
  if (keys['ArrowDown'] && rightPaddle.y < canvas.height - paddleHeight) rightPaddle.y += paddleSpeed;

  // Move ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Top and bottom wall collision
  if (ball.y <= 0 || ball.y + ballSize >= canvas.height) {
    ball.dy = -ball.dy;
  }

  // Paddle collisions
  // Left paddle
  if (ball.x <= leftPaddle.x + paddleWidth &&
      ball.y + ballSize >= leftPaddle.y &&
      ball.y <= leftPaddle.y + paddleHeight) {
    reflectBall(leftPaddle);
  }

  // Right paddle
  if (ball.x + ballSize >= rightPaddle.x &&
      ball.y + ballSize >= rightPaddle.y &&
      ball.y <= rightPaddle.y + paddleHeight) {
    reflectBall(rightPaddle, true);
  }

  // Reset if out of bounds
  if (ball.x < 0 || ball.x > canvas.width) {
    resetBall();
  }
}

function reflectBall(paddle, invertX = false) {
  const collidePoint = (ball.y + ballSize / 2) - (paddle.y + paddleHeight / 2);
  const normalized = collidePoint / (paddleHeight / 2);
  const angle = normalized * (Math.PI / 4); // max 45 degrees
  const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
  ball.dx = speed * Math.cos(angle) * (invertX ? -1 : 1);
  ball.dy = speed * Math.sin(angle);
}

function resetBall() {
  ball.x = canvas.width / 2 - ballSize / 2;
  ball.y = canvas.height / 2 - ballSize / 2;
  ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
  ball.dy = 4 * (Math.random() > 0.5 ? 1 : -1);
}

function draw() {
  // Clear
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Paddles
  ctx.fillStyle = '#fff';
  ctx.fillRect(leftPaddle.x, leftPaddle.y, paddleWidth, paddleHeight);
  ctx.fillRect(rightPaddle.x, rightPaddle.y, paddleWidth, paddleHeight);

  // Ball
  ctx.fillRect(ball.x, ball.y, ballSize, ballSize);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Start the game loop
loop();
