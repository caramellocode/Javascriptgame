class ThrowableObject extends MovableObject {
  height = 60;
  width = 50;

  IMAGES_FLYINGBOTTLE = [
    // Array of image paths for the flying bottle

    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  IMAGES_SPLASH = [
    // Array of image paths for the bottle splash
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  /**
   * Initializes a ThrowableObject with images for flying and splashing states,
   * sets its initial position, speed, and starts the throw animation if parameters are provided.
   */

  constructor(x, y, speedX, speedY, BottleImg) {
    super().loadImage(this.IMAGES_FLYINGBOTTLE[0]);
    this.loadImages(this.IMAGES_FLYINGBOTTLE);
    this.loadImages(this.IMAGES_SPLASH);

    this.x = x;
    this.y = y;
    if (BottleImg != undefined) {
      this.trow(speedX, speedY, BottleImg);
    }
  }

  /**
   * Handles the throw of the bottle, applying gravity, and animating its movement and rotation.
   * @param {integer} speedX - Horizontal speed of the bottle.
   * @param {integer} speedY - Initial vertical speed of the bottle.
   * @param {array} BottleImg - Images to use for the bottle's animation during the throw.
   */
  trow(speedX, speedY, BottleImg) {
    this.speedY = speedY;
    this.applyGravity();
    setInterval(() => {
      this.x += speedX;
      this.playAnimation(BottleImg);
    }, 50);
  }
}
