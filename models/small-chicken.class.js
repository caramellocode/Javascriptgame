class SmallChicken extends MovableObject {
  y = 350;
  speedY = 1.5;
  height = 80;
  width = 60;
  playSound = true;

  // Array of image paths for walking animation

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];
  // Array of image paths for dead animation

  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  chicken_sound = new Audio("audio/chicken.mp3");
  soundsAreNew = true;
  /**
   * Initializes a SmallChicken object with an initial image, sets its position, loads images, and starts its animations.
   */
  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.x = 200 + Math.random() * 2200;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.speed = 0.15 + Math.random() * 4;
    this.animate();
    this.pushSmallChickenSounds();
  }

  /**
   * Sets up intervals for the small chicken's movements and animations.
   */
  animate() {
    setStopableInterval(this.smallChickenMoves, 1500 / 60);
    setStopableInterval(this.playChickenAnimation, 200);
    setStopableInterval(this.showDeadSmallChicken, 1000 / 60);
  }

  /**
   * Moves the small chicken to the left.
   */
  smallChickenMoves = () => {
    this.moveleft();
  };

  /**
   * Plays the walking animation if the small chicken is alive.
   */
  playChickenAnimation = () => {
    if (this.energy == 100) {
      this.playAnimation(this.IMAGES_WALKING);
    }
  };
  /**
   * Shows the dead chicken animation and makes it fall if it's dead.
   */
  showDeadSmallChicken = () => {
    if (this.energy < 100 && this.y < 500) {
      this.playAnimation(this.IMAGES_DEAD);
      this.speed = 0;
      this.playChickenSound();
      this.y += this.speedY;
    }
  };
  /**
   * Plays the chicken sound once when it dies.
   */
  playChickenSound() {
    if (this.playSound) {
      this.chicken_sound.play();
      this.playSound = false;
    }
  }
  /**
   * Adds the small chicken sound to a global array if it's not already added.
   */
  pushSmallChickenSounds() {
    if (this.soundsAreNew) {
      sounds.push(this.chicken_sound);
      this.soundsAreNew = false;
    }
  }
}
