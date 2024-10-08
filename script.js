const dino = document.getElementById("dino");
let isJumping = false;
let cactusSpeed = 1.8;
let difficultyIncreaseInterval;

document.addEventListener("keydown", function (event) {
  if (
    (event.code === "Space" ||
      event.code === "ArrowUp" ||
      event.code === "Enter" ||
      event.code === "ArrowRight" ||
      event.code === "ArrowDown" ||
      event.code === "ArrowLeft") &&
    !isJumping
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
  const cactus = document.createElement("div");
  cactus.classList.add("cactus");
  document.querySelector(".game").appendChild(cactus);
  cactus.style.left = "600px";

  let moveCactus = setInterval(() => {
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
    alert("GAME OVER!");
    document.querySelectorAll(".cactus").forEach((c) => c.remove());
  }
}

function increaseDifficulty() {
  if (cactusSpeed > 0.8) {
    cactusSpeed -= 0.05;
  }
}

function startCreatingCacti() {
  setTimeout(() => {
    createCactus();
    startCreatingCacti();
  }, 500 * cactusSpeed);
}

startCreatingCacti();

difficultyIncreaseInterval = setInterval(function () {
  increaseDifficulty();
}, 5000);
