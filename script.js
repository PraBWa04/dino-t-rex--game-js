const dino = document.getElementById("dino");
const gameOverMessage = document.getElementById("game-over-message");
const scoreDisplay = document.getElementById("score");
const darkModeButton = document.getElementById("darkModeToggle");

let isJumping = false;
let cactusSpeed = 1.8;
let gameOver = false;
let isDarkMode = false;
let score = 0;

darkModeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  isDarkMode = !isDarkMode;
});

function jump() {
  if (isJumping || gameOver) return;
  isJumping = true;
  dino.classList.add("jump");
  setTimeout(() => {
    dino.classList.remove("jump");
    isJumping = false;
  }, 300);
}

function createCactus() {
  if (gameOver) return;
  const cactus = document.createElement("div");
  cactus.classList.add("cactus");
  cactus.style.left = "600px";
  document.querySelector(".game").appendChild(cactus);

  const moveCactus = setInterval(() => {
    if (gameOver) return clearInterval(moveCactus);

    cactus.style.left = `${parseInt(cactus.style.left) - cactusSpeed * 10}px`;

    if (parseInt(cactus.style.left) <= 0) {
      cactus.remove();
      updateScore();
      clearInterval(moveCactus);
    } else {
      checkCollision(cactus, moveCactus);
    }
  }, 20);
}

function checkCollision(cactus, moveCactus) {
  const dinoRect = dino.getBoundingClientRect();
  const cactusRect = cactus.getBoundingClientRect();

  if (
    dinoRect.right > cactusRect.left &&
    dinoRect.left < cactusRect.right &&
    dinoRect.bottom > cactusRect.top
  ) {
    gameOver = true;
    clearInterval(moveCactus);
    showGameOverMessage();
    document.querySelectorAll(".cactus").forEach((c) => c.remove());
  }
}

function showGameOverMessage() {
  gameOverMessage.style.display = "block";
}

function restartGame() {
  gameOver = false;
  score = 0;
  cactusSpeed = 1.8;
  scoreDisplay.innerText = "Score: 0";
  gameOverMessage.style.display = "none";
  startCreatingCacti();
}

function increaseDifficulty() {
  if (cactusSpeed > 0.8) cactusSpeed -= 0.05;
}

function startCreatingCacti() {
  if (!gameOver) {
    createCactus();
    setTimeout(startCreatingCacti, 500 * cactusSpeed);
  }
}

function updateScore() {
  score++;
  scoreDisplay.innerText = `Score: ${score}`;
  if (score % 10 === 0) {
    scoreDisplay.classList.add("score-bonus");
    setTimeout(() => scoreDisplay.classList.remove("score-bonus"), 500);
  }
}

document.addEventListener("keydown", (event) => {
  if (event.code === "Enter" && gameOver) restartGame();
  if (
    ["Space", "ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(
      event.code
    )
  ) {
    jump();
  }
});

startCreatingCacti();
setInterval(increaseDifficulty, 5000);
