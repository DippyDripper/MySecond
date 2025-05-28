document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const scoreDisplay = document.getElementById("score");
  const startBtn = document.getElementById("startBtn");
  const resetBtn = document.getElementById("resetBtn");

  const gridSize = 20;
  let snake, food, dx, dy, score, gameRunning, gameInterval;

  function initGame() {
    snake = [{ x: 200, y: 200 }];
    dx = gridSize;
    dy = 0;
    score = 0;
    gameRunning = false;
    updateScore();
    generateFood();
    draw();
  }

  function startGame() {
    if (!gameRunning) {
      gameRunning = true;
      gameInterval = setInterval(moveSnake, 100);
    }
  }

  function resetGame() {
    clearInterval(gameInterval);
    initGame();
  }

  function generateFood() {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize,
      };
    } while (
      snake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      )
    );
    food = newFood;
  }

  function draw() {
    ctx.fillStyle = getComputedStyle(document.documentElement)
      .getPropertyValue("--canvas-bg")
      .trim();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = getComputedStyle(document.documentElement)
      .getPropertyValue("--snake-color")
      .trim();
    snake.forEach((segment) => {
      ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    ctx.fillStyle = getComputedStyle(document.documentElement)
      .getPropertyValue("--food-color")
      .trim();
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
  }

  function moveSnake() {
    const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(newHead);

    if (newHead.x === food.x && newHead.y === food.y) {
      score++;
      updateScore();
      generateFood();
    } else {
      snake.pop();
    }

    if (checkCollision(newHead)) {
      endGame();
    } else {
      draw();
    }
  }

  function checkCollision(head) {
    return (
      head.x < 0 ||
      head.x >= canvas.width ||
      head.y < 0 ||
      head.y >= canvas.height ||
      snake
        .slice(1)
        .some((segment) => segment.x === head.x && segment.y === head.y)
    );
  }

  function endGame() {
    clearInterval(gameInterval);
    gameRunning = false;
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 28px Segoe UI";
    ctx.textAlign = "center";
    ctx.fillText(
      `Game Over! Score: ${score}`,
      canvas.width / 2,
      canvas.height / 2
    );
  }

  function updateScore() {
    scoreDisplay.textContent = score;
  }

  document.addEventListener("keydown", (e) => {
    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
    ) {
      e.preventDefault();
    }

    if (e.key === " ") {
      if (!gameRunning) {
        startGame();
      } else {
        resetGame();
      }
      return;
    }

    if (!gameRunning) return;

    const goingUp = dy === -gridSize;
    const goingDown = dy === gridSize;
    const goingLeft = dx === -gridSize;
    const goingRight = dx === gridSize;

    if (e.key === "ArrowUp" && !goingDown) {
      dx = 0;
      dy = -gridSize;
    } else if (e.key === "ArrowDown" && !goingUp) {
      dx = 0;
      dy = gridSize;
    } else if (e.key === "ArrowLeft" && !goingRight) {
      dx = -gridSize;
      dy = 0;
    } else if (e.key === "ArrowRight" && !goingLeft) {
      dx = gridSize;
      dy = 0;
    }
  });

  startBtn.addEventListener("click", startGame);
  resetBtn.addEventListener("click", resetGame);

  initGame();
});
