class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  lastJump = 0;
  thisJumped = false;

  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };
  /**
   * Applies gravity effect, causing the object to fall or jump based on its vertical speed and acceleration.
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * Determines if the object is above the ground level to decide if gravity should be applied.
   * @returns {boolean} True if the object is above ground or a ThrowableObject, else false.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 120;
    }
  }
  /**
   * Moves the object to the right by increasing its x-coordinate by the speed amount.
   */
  moveRight() {
    this.x += this.speed;
  }
  /**
   * Moves the object to the left by decreasing its x-coordinate by the speed amount.
   */
  moveleft() {
    this.x -= this.speed;
  }

  /**
   * Plays an animation by cycling through a given array of images.
   * @param {array} imgArray - Array of image paths to animate.
   */
  playAnimation(imgArray) {
    let i = this.currentImage % imgArray.length;
    let path = imgArray[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }
  /**
   * Initiates a jump by setting the object's vertical speed (speedY) to a positive value.
   */
  jump() {
    this.speedY = 30;
  }
  /**
   * Reduces the object's energy by a fixed amount when hit, and updates the time of the last hit.
   */
  hit() {
    this.energy -= 3;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Checks if the object has been hit recently based on the time since the last hit.
   * @returns {boolean} True if the object was hit less than 0.6 seconds ago, else false.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 0.6;
  }

  /**
   * Checks if the object has not been hit recently.
   * @returns {boolean} True if more than 0.6 seconds have passed since the last hit, else false.
   */
  isNotHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed > 0.6;
  }

  /**
   * Determines if the object has jumped by checking its y-coordinate.
   * @returns {boolean} True if the object has jumped, else false.
   */
  isJumped() {
    if (this.y <= 10) {
      this.thisJumped = true;
    }
    return this.thisJumped;
  }
  /**
   * Resets the jumped status when the object reaches ground level again.
   */
  onGroundAgain() {
    if (this.y >= 150) {
      this.thisJumped = false;
    }
  }

  /**
   * Checks if the object is dead based on its energy level.
   * @returns {boolean} True if energy is 0, else false.
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Determines if the object is colliding with another movable object.
   * @param {MovableObject} mo - The other object to check collision with.
   * @returns {boolean} True if colliding, else false.
   */
  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }
}
