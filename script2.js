// Game elements
var ball = document.getElementById("ball");
var game = document.getElementById("game");
var message = document.getElementById("message");
const countdownDisplay = document.getElementById("countdown");
const movespeed = 0.2; // pixels per frame

// Game variables
let score = 0;
var isGameRunning = false;
var interval;
var both = 0,
  count = 0,
  currentblocks = [];
var blocksInterval;
var isGameStarted = false; // tracks if countdown is complete

// Initialize game when clicked
game.addEventListener("click", function () {
  if (!isGameRunning) {
    startGame();
  }
});

function startGame() {
  if (isGameRunning) return;

  score = 0; // Reset when game starts
  isGameRunning = true;
  ball.style.display = "block";
  message.textContent = "Get ready!";

  // Hide cursor
  document.body.classList.add("game-started");

  // Reset game state
  count = 0;
  currentblocks = [];
  ball.style.top = "400px";
  ball.style.left = "190px";
  isGameStarted = false;

  // Clean any existing blocks
  document.querySelectorAll(".block,.hole").forEach((el) => el.remove());

  // Start countdown
  showCountdown(3);
}

function showCountdown(seconds) {
  if (seconds > 0) {
    countdownDisplay.textContent = seconds;
    countdownDisplay.style.opacity = "1";
    setTimeout(() => {
      countdownDisplay.style.opacity = "0";
      setTimeout(() => showCountdown(seconds - 1), 500);
    }, 500);
  } else {
    countdownDisplay.textContent = "";
    countdownDisplay.style.opacity = "1";
    setTimeout(() => {
      countdownDisplay.style.opacity = "0";
      isGameStarted = true;
      message.textContent = "score: 0";
      blocksInterval = setInterval(updateGame, 1);
    }, 500);
  }
}

function moveLeft() {
  if (!isGameStarted) return;
  var left = parseInt(ball.style.left);
  if (left > 0) {
    ball.style.left = left - 2 + "px";
  }
}

function moveRight() {
  if (!isGameStarted) return;
  var left = parseInt(ball.style.left);
  if (left < 380) {
    ball.style.left = left + 2 + "px";
  }
}

// Keyboard controls
document.addEventListener("keydown", function (event) {
  if (!isGameRunning || !isGameStarted) return;

  if (both === 0) {
    if (event.key === "ArrowLeft") {
      interval = setInterval(moveLeft, 1);
    }
    if (event.key === "ArrowRight") {
      interval = setInterval(moveRight, 1);
    }
  }
  both++;
});

document.addEventListener("keyup", function () {
  clearInterval(interval);
  both = 0;
});

function updateGame() {
  if (!isGameStarted) return;

  let lastBlock = document.getElementById("block" + (count - 1));
  let lastHole = document.getElementById("hole" + (count - 1));

  let lastBlocktop = 0;
  let lastHoletop = 0;

  if (lastBlock && lastHole) {
    lastBlocktop = parseInt(window.getComputedStyle(lastBlock).getPropertyValue("top"));
    lastHoletop = parseInt(window.getComputedStyle(lastHole).getPropertyValue("top"));
  }

  if (lastBlocktop < 400 || count == 0) {
    var block = document.createElement("div");
    var hole = document.createElement("div");
    block.setAttribute("class", "block");
    hole.setAttribute("class", "hole");
    block.setAttribute("id", "block" + count);
    hole.setAttribute("id", "hole" + count);

    block.style.top = (count == 0 ? 100 : lastBlocktop + 100) + "px";
    hole.style.top = (count == 0 ? 100 : lastHoletop + 100) + "px";

    var random = Math.floor(Math.random() * 360);
    hole.style.left = random + "px";

    game.appendChild(block);
    game.appendChild(hole);

    currentblocks.push(count);
    count++;
  }

  var ballTop = parseInt(ball.style.top);
  var ballLeft = parseInt(ball.style.left);
  var drop = 0;

  if (ballTop <= 0) {
    endGame();
    return;
  }

  for (let i = 0; i < currentblocks.length; i++) {
    let currentblock = currentblocks[i];
    let iTHBlock = document.getElementById("block" + currentblock);
    let iTHHole = document.getElementById("hole" + currentblock);

    if (!iTHBlock || !iTHHole) continue;

    let iTHBlock_top = parseFloat(iTHBlock.style.top);
    let iTHHole_left = parseFloat(iTHHole.style.left);

    iTHBlock.style.top = iTHBlock_top - movespeed + "px";
    iTHHole.style.top = iTHBlock_top - movespeed + "px";

    if (iTHBlock_top < -20) {
      currentblocks.shift();
      iTHBlock.remove();
      iTHHole.remove();
      score++;
      message.textContent = "score: " + score;
    }

    if (iTHBlock_top <= ballTop + 20 && iTHBlock_top > ballTop) {
      if (iTHHole_left <= ballLeft && iTHHole_left + 40 >= ballLeft) {
        drop = 0;
      } else {
        drop++;
      }
    }
  }

  if (drop == 0) {
    if (ballTop < 488) {
      ball.style.top = ballTop + 2 + "px";
    }
  } else {
    ball.style.top = ballTop - 0.5 + "px";
  }
}

function endGame() {
  isGameRunning = false;
  isGameStarted = false;
  clearInterval(blocksInterval);
  clearInterval(interval);
  ball.style.display = "none";

  // Show cursor again
  document.body.classList.remove("game-started");

  message.textContent = "Game Over! score: " + score + " (Click to play again.)";
}