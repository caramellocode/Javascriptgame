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

  /**
   * Überprüft, ob das Spiel startbereit ist
   */
  checkForGameStart() {
    if (this.gamestart) {
      initLevel();
      this.level = level1;
      this.level.enemies[4].energy = 100;
      this.character.energy = 100;
      this.pushSoundInArray();
    }
  }
  /**
   * Fügt den aktuellen Sound dem Sounds-Array hinzu
   */
  pushSoundInArray() {
    if (this.soundsAreNew) {
      sounds.push(this.collectBottle_sound);
      sounds.push(this.smashedBottle_sound);
      sounds.push(this.collectedCoin_sound);
      sounds.push(this.winGame_sound);
      this.soundsAreNew = false;
    }
  }

  /**
   * Überprüft, ob die Funktion 'run' ausgeführt werden kann
   */
  checkForRunning = () => {
    if (this.gamestart) {
      this.run();
    }
  };

  /**
   * Legt den Punkt der Welt fest, der für den Charakter verwendet wird
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Überprüft alle Bedingungen, die für das Spiel verwendet werden
   */
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
  /**
   * Überprüft, ob der Charakter auf den Feinden gesprungen ist
   */
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

  /**
   * Überprüft, ob der Endboss angreifen muss
   */
  checkForEndbossAttack() {
    this.space =
      this.level.enemies[this.level.enemies.length - 1].x - this.character.x;
  }

  /**
   * Überprüft, ob die Flasche einen Feind trifft
   */
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

  /**
   * Überprüft, ob der Charakter tot ist
   */
  checkDeadOfCharacter() {
    if (this.character.isDead() && !this.gameEnded) {
      this.characterDied = true;
      this.gameEnded = true; // Markiere das Spiel als beendet

      for (let i = 0; i < this.character.IMAGES_DEATH.length; i++) {
        this.character.playAnimation(this.character.IMAGES_DEATH);
      }

      // Verzögerung vor dem Anzeigen des "You Lost"-Overlays
      setTimeout(() => {
        this.showYouLostOverlay(); // Aufruf der Methode, die das "You Lost"-Overlay anzeigt
      }, 2000); // 2 Sekunden Verzögerung
    }
  }

  showYouLostOverlay() {
    // Overlay-Erstellung und Anzeige, wie bereits definiert
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    const image = new Image();
    image.src = "img/9_intro_outro_screens/game_over/you lost.png";
    image.className = "overlay-image";

    const button = document.createElement("button");
    button.innerText = "Nochmal versuchen";
    button.className = "retry-button";
    button.addEventListener("click", function () {
      location.reload();
    });

    overlay.appendChild(image);
    overlay.appendChild(button);
    document.body.appendChild(overlay);
  }

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

  /**
   * Überprüft, ob der Endboss tot ist
   */
  checkDeadOfEndboss() {
    if (
      this.level.enemies[this.level.enemies.length - 1].isDead() &&
      !this.endbossDied
    ) {
      this.endbossDied = true;

      // Hier würde Ihre Logik stehen, um die Endboss-Todesanimation zu starten
      // Nachdem die Animation gestartet (oder beendet) wurde:
      setTimeout(() => {
        showEndBossDefeatedOverlay();
      }, 2000); // Warte 2 Sekunden nach der Animation, dann zeige das Overlay
    }
  }

  /**
   * Überprüft, ob eine Flasche geworfen wird
   */
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

  /**
   * Überprüft die Kollision des Charakters mit einem Feind
   */
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

  /**
   * Überprüft, ob der Charakter Münzen gesammelt hat
   */
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

  /**
   * Überprüft, ob der Charakter Flaschen gesammelt hat
   */
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

  /**
   * Zeichnet die Welt
   */
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

  /**
   * Fügt Objekte zur Karte hinzu
   */
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

  /**
   * Fügt die Statusleisten zur Karte hinzu
   */
  addStatusbarsToMap() {
    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarCoin);
    this.addToMap(this.statusBarBottle);
    this.addToMap(this.statusBarEndboss);
    this.addToMap(this.healthImg);
  }

  /**
   * Aktion, die ausgeführt wird, wenn das Spiel verloren geht
   */
  youLostTheGame() {
    if (!this.gameEnded && this.characterDied) {
      this.gameEnded = true;

      // Bereinige den Canvas und zeige den "Oh no, you lost!"-Bildschirm sofort
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

      // Verwende setTimeout, um eine Verzögerung einzuführen, bevor das Spiel neu gestartet wird
      setTimeout(() => {
        stopGame(); // Stoppe alle Spiel-Intervalle und Logik, wenn überhaupt vorhanden
        showRestartBtn(); // Zeige einen Button, um das Spiel neu zu starten
        // Oder lade die Seite neu, wenn du sofort neustarten möchtest: location.reload();
      }, 5000); // Warte 5 Sekunden, bevor die Logik zum Neustart ausgeführt wird
    }
  }

  showEndbossDeathAnimation() {
    // Erstelle ein neues Image-Objekt für die Endboss-Dead-Animation
    let endbossDeadImage = new Image();
    endbossDeadImage.src =
      "img/4_enemie_boss_chicken/5_dead/Muestra_herida_y_muerte.gif"; // Pfad zum Endboss-Dead-GIF

    endbossDeadImage.onload = () => {
      // Zeichne das Endboss-Dead-GIF auf dem Canvas
      this.ctx.drawImage(
        endbossDeadImage,
        this.level.enemies[this.level.enemies.length - 1].x,
        this.level.enemies[this.level.enemies.length - 1].y
      );
    };
  }

  /**
   * Aktion, die ausgeführt wird, wenn das Spiel gewonnen wird
   */
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
    // Unterbrechen Sie die reguläre Zeichenschleife, um zu verhindern, dass der Endscreen sofort überschrieben wird
    cancelAnimationFrame(this.animationFrameId);

    // Warte, bis die Endboss-Dead-Animation abgeschlossen ist
    let endbossDeadImage = new Image();
    endbossDeadImage.src =
      "img/4_enemie_boss_chicken/5_dead/Muestra_herida_y_muerte.gif";

    endbossDeadImage.onload = () => {
      // Stellen Sie sicher, dass alle Transformationen zurückgesetzt werden
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      // Löschen Sie den gesamten Canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Zeichne das Endboss-Dead-GIF auf dem Canvas
      this.ctx.drawImage(
        endbossDeadImage,
        this.level.enemies[this.level.enemies.length - 1].x,
        this.level.enemies[this.level.enemies.length - 1].y
      );

      // Nachdem das GIF geladen und gezeichnet wurde, warte 2 Sekunden, dann zeige den Endscreen an
      setTimeout(() => {
        this.showGameWinScreen();
      }, 2000);
    };
  }

  showGameWinScreen() {
    // Markiere das Spiel als beendet, um zu verhindern, dass das "You Lost"-Overlay angezeigt wird
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

  /**
   * Fügt Objekte zur Karte hinzu
   * @param {object} objects
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Fügt ein einzelnes Objekt zur Karte hinzu
   * @param {object} mo
   */
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

  /**
   * Kippt/Dreht das Bild unter den richtigen Bedingungen
   * @param {object} mo
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Setzt die Umkehrung des Bildes zurück
   * @param {object} mo
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
