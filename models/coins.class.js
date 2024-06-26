class Coins extends MovableObject {
  height = 50;
  width = 50;
  offset = {
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
  };

  IMAGES_MOVING = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  /**
   * Constructs a Coin object with an initial image, sets a random position, and starts its animation.
   */
  constructor() {
    super().loadImage(this.IMAGES_MOVING[0]);
    this.loadImages(this.IMAGES_MOVING);
    this.x = Math.random() * 2000;
    this.y = 100 + Math.random() * 100;
    this.animate();
  }

  /**
   * Initiates the coin's animation.
   */
  animate() {
    setStopableInterval(this.moveCoin, 500);
  }

  /**
   * Cycles through the coin's images to create an animation effect.
   */
  moveCoin = () => {
    this.playAnimation(this.IMAGES_MOVING);
  };
}
