let canvas;
let gamestart = false;
let world;
let keyboard = new Keyboard();
let fullscreen = false;
let game_song = new Audio("audio/Tequila.mp3");
let soundIsRunning = false;
let intervalIds = [];
let sounds = [];
let i = 1;
let soundsAreNew = true;

/**
 * Loads the page.
 */
function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
}

/**
 * Starts the game on click.
 */
function startTheGame() {
  gameStart();
  world.checkForGameStart();
  hideButton();
  steerSound();
  hideIconFullscreen();
  pushGameSoundInArray();
  game_song.play();
}

function showEndBossDefeatedOverlay() {
  const overlay = document.createElement("div");
  overlay.className = "overlay"; // Assigns the CSS class to the overlay.

  const image = new Image();
  image.src = "img/9_intro_outro_screens/game_over/winner.jpg"; // Path to your overlay image.
  image.className = "overlay-image"; // Assigns the CSS class to the image.

  // Create button.
  const button = document.createElement("button");
  button.innerText = "Try again";
  button.className = "retry-button"; // Ensure you have styles for this class in your CSS.
  button.style.position = "absolute";
  button.style.left = "50%";
  button.style.transform = "translateX(-50%)"; // Centers the button horizontally.
  button.style.bottom = "20px"; // Distance from the bottom of the overlay.

  // Event listener for the button.
  button.addEventListener("click", function () {
    location.reload(); // Reloads the page.
  });

  overlay.appendChild(image);
  overlay.appendChild(button); // Adds the button to the overlay.
  document.body.appendChild(overlay);

  // The event listener for clicking on the overlay to remove it was removed.
  // The overlay remains until the button is clicked.
}

/**
 * Pushes the current sound into the sounds array.
 */
function pushGameSoundInArray() {
  if (soundsAreNew) {
    sounds.push(game_song);
    soundsAreNew = false;
  }
}

/**
 * Sets the correct booleans for game start.
 */
function gameStart() {
  world.gamestart = true;
  world.characterDied = false;
  world.endbossDied = false;
}

/**
 * Hides the start button.
 */
function hideButton() {
  document.getElementById("startBtn").style = "display: none;";
}

function hideIconFullscreen() {
  if (window.innerWidth < 480) {
    document.getElementById("fullscreenIcon").style = "display: none;";
  }
}

/**
 * Steers the sound for the game.
 */
function steerSound() {
  if (soundIsRunning) {
    sounds.forEach((sound) => {
      sound.muted = true;
    });
    soundIsRunning = false;
    document.getElementById("soundON").src = "img/9_intro_outro_screens/soundOFF.png";
  } else {
    sounds.forEach((sound) => {
      sound.muted = false;
    });
    soundIsRunning = true;
    document.getElementById("soundON").src = "img/9_intro_outro_screens/soundOn.png";
  }
}

/**
 * Sets an interval for a function and pushes the interval's ID into the "intervalIds" array.
 * @param {Function} fn - The function to be executed.
 * @param {Number} time - The interval time in milliseconds.
 */
function setStopableInterval(fn, time) {
  let id = setInterval(fn, time);
  intervalIds.push(id);
}

/**
 * Stops the game by clearing all intervals in the "intervalIds" array.
 */
function stopGame() {
  if (!world.gameEnded) {
    intervalIds.forEach(clearInterval);
    world.gameEnded = true;
  }
}

/**
 * If the game is stopped, this function starts a new match.
 */
function restartTheGame() {
  gameStart();
  document.getElementById("restartBtn").style = "display: none;";
  world = new World(canvas, keyboard);
  startTheGame();
}

/**
 * Shows the button for starting a new match.
 */
function showRestartBtn() {
  document.getElementById("restartBtn").style = "display: flex;";
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    // IE11
    document.msExitFullscreen();
  } else if (document.webkitExitFullscreen) {
    // Safari
    document.webkitExitFullscreen();
  }
}

/**
 * checks fullscreen status and shows the right icon
 */
function becomeFullscreen() {
  let fullscreenDiv = document.getElementById("fullscreen");
  if (fullscreen) {
    exitFullscreen();
    document.getElementById("absolute").classList.remove("absoluteFullscreen");
    document.getElementById("canvas").classList.remove("canvasFullscreen");
    document.getElementById("fullscreenIcon").src =
      "img/9_intro_outro_screens/fullscreen.svg";
    fullscreen = false;
  } else {
    enterFullscreen(fullscreenDiv);
    document.getElementById("fullscreenIcon").src =
      "img/9_intro_outro_screens/exitFullscreen.png";
    document.getElementById("absolute").classList.add("absoluteFullscreen");
    document.getElementById("canvas").classList.add("canvasFullscreen");
    fullscreen = true;
  }
}

/**
 * starts fullscreen
 * @param {string} element
 */
function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    // for IE11 (remove June 15, 2022)
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    // iOS Safari
    element.webkitRequestFullscreen();
  }
  fullscreen = true;
}

window.addEventListener("keydown", (e) => {
  if (e.keyCode == 39 && !world.gameEnded) {
    keyboard.RIGHT = true;
  }
  if (e.keyCode == 37 && !world.gameEnded) {
    keyboard.LEFT = true;
  }
  if (e.keyCode == 38 && !world.gameEnded) {
    keyboard.UP = true;
  }
  if (e.keyCode == 40 && !world.gameEnded) {
    keyboard.DOWN = true;
  }
  if (e.keyCode == 32 && !world.gameEnded) {
    keyboard.SPACE = true;
  }
  if (e.keyCode == 68 && !world.gameEnded && !world.throwLock) {
    world.throwLock = true;
    keyboard.D = true;
    setTimeout(() => {
      world.throwLock = false;
    }, 400);
  }
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = false;
  }
  if (e.keyCode == 37) {
    keyboard.LEFT = false;
  }
  if (e.keyCode == 38) {
    keyboard.UP = false;
  }
  if (e.keyCode == 40) {
    keyboard.DOWN = false;
  }
  if (e.keyCode == 32) {
    keyboard.SPACE = false;
  }
  if (e.keyCode == 68) {
    keyboard.D = false;
  }
  if (e.keyCode === 70) {
    keyboard.F = false;
  }
});

/**
 * listens for touchevents to steer the mobile game
 */
function moveOnMobile() {
  moveLeftOnMobile();
  moveRightOnMobile();
  jumpOnMobile();
  throwBottleOnMobile();
}

/**
 * listens for touchevents to steer the mobile game
 */
function moveLeftOnMobile() {
  document.getElementById("btnLeft").addEventListener("touchstart", (e) => {
    if (e.cancelable) e.preventDefault();
    world.keyboard.LEFT = true;
  });

  document.getElementById("btnLeft").addEventListener("touchend", (e) => {
    if (e.cancelable) e.preventDefault();
    world.keyboard.LEFT = false;
  });
}

/**
 * listens for touchevents to steer the mobile game
 */
function moveRightOnMobile() {
  document.getElementById("btnRight").addEventListener("touchstart", (e) => {
    if (e.cancelable) e.preventDefault();
    world.keyboard.RIGHT = true;
  });

  document.getElementById("btnRight").addEventListener("touchend", (e) => {
    if (e.cancelable) e.preventDefault();
    world.keyboard.RIGHT = false;
  });
}

/**
 * listens for touchevents to steer the mobile game
 */
function jumpOnMobile() {
  document.getElementById("btnJump").addEventListener("touchstart", (e) => {
    if (e.cancelable) e.preventDefault();
    world.keyboard.SPACE = true;
  });

  document.getElementById("btnJump").addEventListener("touchend", (e) => {
    if (e.cancelable) e.preventDefault();
    world.keyboard.SPACE = false;
  });
}

/**
 * listens for touchevents to steer the mobile game
 */
function throwBottleOnMobile() {
  document.getElementById("throwBottle").addEventListener("touchstart", (e) => {
    if (e.cancelable) e.preventDefault();
    world.keyboard.D = true;
  });

  document.getElementById("throwBottle").addEventListener("touchend", (e) => {
    if (e.cancelable) e.preventDefault();
    world.keyboard.D = false;
  });
}
