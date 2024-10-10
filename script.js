const dino = document.getElementById("dino");
const gameOverMessage = document.getElementById("game-over-message");
let isJumping = false;
let cactusSpeed = 1.8;
let difficultyIncreaseInterval;
let gameOver = false;
let isDarkMode = false;

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  isDarkMode = !isDarkMode;
}

document.addEventListener("keydown", function (event) {
  if (gameOver && event.code === "Enter") {
    restartGame();
  }

  if (
    (event.code === "Space" ||
      event.code === "ArrowUp" ||
      event.code === "ArrowRight" ||
      event.code === "ArrowDown" ||
      event.code === "ArrowLeft") &&
    !isJumping &&
    !gameOver
  ) {
    jump();
  }
});

function jump() {
  isJumping = true;
  dino.classList.add("jump");

  setTimeout(function () {
    dino.classList.remove("jump");
    isJumping = false;
  }, 340);
}

function createCactus() {
  if (gameOver) return;

  const cactus = document.createElement("div");
  cactus.classList.add("cactus");
  document.querySelector(".game").appendChild(cactus);
  cactus.style.left = "600px";

  let moveCactus = setInterval(() => {
    if (gameOver) {
      clearInterval(moveCactus);
      return;
    }

    let cactusLeft = parseInt(
      window.getComputedStyle(cactus).getPropertyValue("left")
    );

    if (cactusLeft > 0) {
      cactus.style.left = cactusLeft - cactusSpeed * 10 + "px";
    } else {
      clearInterval(moveCactus);
      cactus.remove();
    }

    checkCollision(cactus, moveCactus);
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
    clearInterval(moveCactus);
    clearInterval(difficultyIncreaseInterval);
    gameOver = true;
    showGameOverMessage();

    document.querySelectorAll(".cactus").forEach((c) => {
      if (c !== cactus) c.remove();
    });
  }
}

function showGameOverMessage() {
  gameOverMessage.style.display = "block";
}

function restartGame() {
  gameOver = false;
  gameOverMessage.style.display = "none";
  cactusSpeed = 1.8;

  document.querySelectorAll(".cactus").forEach((c) => c.remove());

  if (isDarkMode) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }

  startCreatingCacti();
  difficultyIncreaseInterval = setInterval(increaseDifficulty, 5000);
}

function increaseDifficulty() {
  if (cactusSpeed > 0.8) {
    cactusSpeed -= 0.05;
  }
}

function startCreatingCacti() {
  if (!gameOver) {
    setTimeout(() => {
      createCactus();
      startCreatingCacti();
    }, 500 * cactusSpeed);
  }
}

startCreatingCacti();
difficultyIncreaseInterval = setInterval(function () {
  increaseDifficulty();
}, 5000);

const darkModeButton = document.querySelector(".button-1");
darkModeButton.addEventListener("click", toggleDarkMode);
