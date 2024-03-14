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
    collectBottle_sound = new Audio('audio/collectBottle.mp3');
    smashedBottle_sound = new Audio('audio/smashedBottle.mp3');
    collectedCoin_sound = new Audio('audio/collectCoin.mp3');
    winGame_sound = new Audio('audio/winGame.mp3');
    soundsAreNew = true;
    bottlePercentage;
    coinPercentage;
    throwLock = false;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard
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
            this.level.enemies[4].energy = 100
            this.character.energy = 100
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
    }

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
            if (this.character.isColliding(enemy) && this.character.isAboveGround() && this.character.isNotHurt() && this.character.isJumped()) {
                this.character.jump();
                enemy.energy -= 100;
            }
        }
    }

    /**
     * Überprüft, ob der Endboss angreifen muss
     */
    checkForEndbossAttack() {
        this.space = this.level.enemies[this.level.enemies.length - 1].x - this.character.x
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
                    this.statusBarEndboss.setPercentage(enemy.energy)
                    this.bottle.trow(0, 2, this.bottle.IMAGES_SPLASH);
                }
            })
        }
    }

    /**
     * Überprüft, ob der Charakter tot ist
     */
    checkDeadOfCharacter() {

        if (this.character.isDead()) {
            this.characterDied = true;
            for (let i = 0; i < this.character.IMAGES_DEATH.length; i++) {
                this.character.playAnimation(this.character.IMAGES_DEATH);
            }
        }
    }

    checkIfCharacterIsBehindBoss(){
        if(this.character.x > this.level.enemies[this.level.enemies.length - 1].x){
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
        if (this.level.enemies[this.level.enemies.length - 1].isDead()) {
            this.endbossDied = true;
        }
    }

    /**
     * Überprüft, ob eine Flasche geworfen wird
     */
    checkThrowObjects() {
        if (this.keyboard.D && this.useableBottle != 0) {
                this.bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100, 30, 30, this.bottle.IMAGES_FLYINGBOTTLE);
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

        this.level.enemies.forEach(enemy => {
            if (this.character.isColliding(enemy) && !(this.character.isAboveGround()) && !(this.character.isDead())) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy)
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

            if (this.characterDied)
                this.youLostTheGame();
            if (this.endbossDied)
                this.youWonTheGame();
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
        this.endscreen = new BackgroundObject('img/9_intro_outro_screens/game_over/oh no you lost!.png', this.character.x - 100);
        this.addToMap(this.endscreen);
        stopGame();
        showRestartBtn();
        this.gameEnded = false;
    }

    /**
     * Aktion, die ausgeführt wird, wenn das Spiel gewonnen wird
     */
    youWonTheGame() {
        this.endscreen = new BackgroundObject('img/9_intro_outro_screens/game_over/winner.jpg', this.character.x - 100);
        this.addToMap(this.endscreen);
        !this.gameEnded ? this.winGame_sound.play() : '';
        stopGame();
        showRestartBtn();
    }

    /**
     * Fügt Objekte zur Karte hinzu
     * @param {object} objects 
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o)
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
            this.flipImageBack(mo)
        }
    }

    /**
     * Kippt das Bild unter den richtigen Bedingungen
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
