class World {
  character = new Character();
  camera_x = 0;
  canvas;
  ctx;
  keyboard;
  statusBar = new StatusBar();
  statusBarCoin = new StatusbarCoin();
  statusBarBottle = new StatusBarBottle();
  statusBarEndboss = new StatusbarEndboss();
  healthImg = new HealthImg();
  throwableObject = [];
  collectedCoins = [];
  useableBottle = 0;
  bottle = new ThrowableObject();
  startscreen = new Startscreen();
  endscreen;
  gamestart = false;
  characterDied = false;
  endbossDied = false;
  gameover = false;
  space = 0;
  gameEnded = false;
  collectBottle_sound = new Audio("audio/collectBottle.mp3");
  smashedBottle_sound = new Audio("audio/smashedBottle.mp3");
  collectedCoin_sound = new Audio("audio/collectCoin.mp3");
  winGame_sound = new Audio("audio/winGame.mp3");
  soundsAreNew = true;
  bottlePercentage;
  coinPercentage;
  throwLock = false;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.setWorld();
    this.draw();
    setStopableInterval(this.checkForRunning, 50);
    setStopableInterval(this.checkBottleHit, 100);
  }

  // Checks if the game is ready to start

  checkForGameStart() {
    if (this.gamestart) {
      initLevel();
      this.level = level1;
      this.level.enemies[4].energy = 100;
      this.character.energy = 100;
      this.pushSoundInArray();
    }
  }
  // Adds the current sound to the Sounds array

  pushSoundInArray() {
    if (this.soundsAreNew) {
      sounds.push(this.collectBottle_sound);
      sounds.push(this.smashedBottle_sound);
      sounds.push(this.collectedCoin_sound);
      sounds.push(this.winGame_sound);
      this.soundsAreNew = false;
    }
  }

  // Checks if the 'run' function can be executed

  checkForRunning = () => {
    if (this.gamestart) {
      this.run();
    }
  };

  // Sets the point in the world that is used for the character

  setWorld() {
    this.character.world = this;
  }

  // Checks all conditions used for the game
  run() {
    this.checkCollision();
    this.collectCoins();
    this.collectBottles();
    this.checkThrowObjects();
    this.jumpOnEnemies();
    this.checkDeadOfCharacter();
    this.checkForEndbossAttack();
    this.checkDeadOfEndboss();
    this.character.isJumped();
    this.character.onGroundAgain();
    this.checkIfCharacterIsBehindBoss();
    this.checkBottleHit();
  }
  // Checks if the character has jumped on the enemies

  jumpOnEnemies() {
    for (let i = 0; i < this.level.enemies.length - 1; i++) {
      const enemy = this.level.enemies[i];
      if (
        this.character.isColliding(enemy) &&
        this.character.isAboveGround() &&
        this.character.isNotHurt() &&
        this.character.isJumped()
      ) {
        this.character.jump();
        enemy.energy -= 100;
      }
    }
  }

  // Checks if the endboss is attacking
  checkForEndbossAttack() {
    this.space =
      this.level.enemies[this.level.enemies.length - 1].x - this.character.x;
  }

  // Checks if the bottle has hit an enemy
  checkBottleHit = () => {
    if (this.gamestart) {
      this.level.enemies.forEach((enemy) => {
        if (this.bottle.isColliding(enemy)) {
          enemy.hit();
          this.smashedBottle_sound.play();
          this.statusBarEndboss.setPercentage(enemy.energy);
          this.bottle.trow(0, 2, this.bottle.IMAGES_SPLASH);
        }
      });
    }
  };

  // Checks if the character is dead
  checkDeadOfCharacter() {
    if (this.character.isDead() && !this.gameEnded) {
      this.characterDied = true;
      this.gameEnded = true; // Markiere das Spiel als beendet

      for (let i = 0; i < this.character.IMAGES_DEATH.length; i++) {
        this.character.playAnimation(this.character.IMAGES_DEATH);
      }

      // If the character is dead, show the "You Lost" overlay after 2 seconds
      setTimeout(() => {
        this.showYouLostOverlay(); // Show the "You Lost" overlay after 2 seconds
      }, 2000); // 2000ms = 2 seconds
    }
  }

  showYouLostOverlay() {
    // Create the overlay with the "You Lost" message and a "Retry" button
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    const image = new Image();
    image.src = "img/9_intro_outro_screens/game_over/you lost.png";
    image.className = "overlay-image";
    // Create a button to reload the page
    const button = document.createElement("button");
    button.innerText = "Nochmal versuchen";
    button.className = "retry-button";
    button.addEventListener("click", function () {
      location.reload();
    });
    // Add the image and button to the overlay
    overlay.appendChild(image);
    overlay.appendChild(button);
    document.body.appendChild(overlay);
  }
  // Checks if the character is behind the endboss
  checkIfCharacterIsBehindBoss() {
    if (
      this.character.x > this.level.enemies[this.level.enemies.length - 1].x
    ) {
      this.character.isDead();
      this.characterDied = true;
      for (let i = 0; i < this.character.IMAGES_DEATH.length; i++) {
        this.character.playAnimation(this.character.IMAGES_DEATH);
      }
    }
  }

  // Checks if the endboss is dead
  checkDeadOfEndboss() {
    if (
      this.level.enemies[this.level.enemies.length - 1].isDead() &&
      !this.endbossDied
    ) {
      this.endbossDied = true;

      setTimeout(() => {
        showEndBossDefeatedOverlay();
      }, 2000);
    }
  }

  // Checks if a bottle is being thrown

  checkThrowObjects() {
    if (this.keyboard.D && this.useableBottle != 0) {
      this.bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100,
        30,
        30,
        this.bottle.IMAGES_FLYINGBOTTLE
      );
      this.throwableObject.push(this.bottle);
      this.useableBottle--;
      this.bottlePercentage = this.useableBottle * 20;
      this.statusBarBottle.setPercentage(this.bottlePercentage);
      this.keyboard.D = false;
    }
  }

  // Checks the collision of the character with an enemy

  checkCollision() {
    this.level.enemies.forEach((enemy) => {
      if (
        this.character.isColliding(enemy) &&
        !this.character.isAboveGround() &&
        !this.character.isDead()
      ) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    });
  }

  // Checks if the character has collected coins

  collectCoins() {
    for (let i = 0; i < this.level.coins.length; i++) {
      const coin = this.level.coins[i];
      if (this.character.isColliding(coin)) {
        this.collectedCoin_sound.play();
        this.level.coins.splice(i, 1);
        this.collectedCoins.push(coin);
        this.coinPercentage = this.collectedCoins.length * 20;
        this.statusBarCoin.setPercentage(this.coinPercentage);
      }
    }
  }

  // Checks if the character has collected bottles

  collectBottles() {
    for (let i = 0; i < this.level.bottles.length; i++) {
      const collectedbottle = this.level.bottles[i];
      if (this.character.isColliding(collectedbottle)) {
        this.level.bottles.splice(i, 1); // flasche wird nicht mehr angezeigt
        this.collectBottle_sound.play();
        this.useableBottle++;
        this.bottlePercentage = this.useableBottle * 20;
        this.statusBarBottle.setPercentage(this.bottlePercentage);
      }
    }
  }

  // Draws the world

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.startscreen);
    this.ctx.translate(-this.camera_x, 0);

    if (this.gamestart) {
      this.addAllObjectsToMap();

      if (this.characterDied) this.youLostTheGame();
      if (this.endbossDied) this.youWonTheGame();
      this.ctx.translate(-this.camera_x, 0);
      this.addStatusbarsToMap();
    }

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  // Adds objects to the map

  addAllObjectsToMap() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addToMap(this.character);
    this.addObjectsToMap(this.throwableObject);
  }

  // Adds the status bars to the map

  addStatusbarsToMap() {
    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarCoin);
    this.addToMap(this.statusBarBottle);
    this.addToMap(this.statusBarEndboss);
    this.addToMap(this.healthImg);
  }

  // Action executed when the game is lost

  youLostTheGame() {
    if (!this.gameEnded && this.characterDied) {
      this.gameEnded = true;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const lostScreen = new Image();
      lostScreen.onload = () => {
        this.ctx.drawImage(
          lostScreen,
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );
      };
      lostScreen.src =
        "img/9_intro_outro_screens/game_over/oh no you lost!.png";

      setTimeout(() => {
        stopGame();
        showRestartBtn();
      }, 5000);
    }
  }

  showEndbossDeathAnimation() {
    // Create a new Image object for the end boss death animation
    let endbossDeadImage = new Image();
    endbossDeadImage.src =
      "img/4_enemie_boss_chicken/5_dead/Muestra_herida_y_muerte.gif"; // Pfad zum Endboss-Dead-GIF

    endbossDeadImage.onload = () => {
      this.ctx.drawImage(
        endbossDeadImage,
        this.level.enemies[this.level.enemies.length - 1].x,
        this.level.enemies[this.level.enemies.length - 1].y
      );
    };
  }

  // Action executed when the game is won

  youWonTheGame(animationFinished = false) {
    if (animationFinished) {
      this.endscreen = new BackgroundObject(
        "img/9_intro_outro_screens/game_over/winner.jpg",
        this.character.x - 100
      );
      this.addToMap(this.endscreen);
      if (!this.gameEnded) {
        this.winGame_sound.play();
        this.gameEnded = true;
      }
      stopGame();
      showRestartBtn();
    }
  }

  finalizeGameWin() {
    // Interrupt the regular drawing loop to prevent the end screen from being immediately overwritten
    cancelAnimationFrame(this.animationFrameId);

    let endbossDeadImage = new Image();
    endbossDeadImage.src =
      "img/4_enemie_boss_chicken/5_dead/Muestra_herida_y_muerte.gif";

    endbossDeadImage.onload = () => {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.drawImage(
        endbossDeadImage,
        this.level.enemies[this.level.enemies.length - 1].x,
        this.level.enemies[this.level.enemies.length - 1].y
      );

      setTimeout(() => {
        this.showGameWinScreen();
      }, 2000);
    };
  }

  showGameWinScreen() {
    // Mark the game as ended to prevent the "You Lost" overlay from being displayed
    this.gameEnded = true;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let endScreenImg = new Image();
    endScreenImg.onload = () => {
      this.ctx.drawImage(
        endScreenImg,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
    };
    endScreenImg.src = "img/9_intro_outro_screens/game_over/winner.jpg";
  }

  // Adds objects to the map
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  // Adds an object to the map
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    //mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  // Flips the image
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  // Flips the image back
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
