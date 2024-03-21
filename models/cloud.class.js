class Cloud extends MovableObject {
  y = 20;
  width = 500;
  height = 250;

  /**
   * Constructs a Cloud object with an image, random initial x-position, and starts its animation.
   */

  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
    this.x = Math.random() * 500;
    this.animate();
  }
  /**
   * Initiates the cloud's movement.
   */
  animate() {
    setStopableInterval(this.moveClouds, 1000 / 25);
  }
  /**
   * Moves the cloud to the left to simulate cloud motion.
   */
  moveClouds = () => {
    this.moveleft();
  };
}
