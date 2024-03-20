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

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   *
   * @returns
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 120;
    }
  }

  moveRight() {
    this.x += this.speed;
  }

  moveleft() {
    this.x -= this.speed;
  }

  /**
   *
   * @param {array} imgArray
   */
  playAnimation(imgArray) {
    let i = this.currentImage % imgArray.length;
    let path = imgArray[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  jump() {
    this.speedY = 30;
  }

  hit() {
    this.energy -= 3;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   *
   * @returns
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 0.6;
  }

  /**
   *
   * @returns
   */
  isNotHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed > 0.6;
  }

  /**
   *
   * @returns
   */
  isJumped() {
    if (this.y <= 10) {
      this.thisJumped = true;
    }
    return this.thisJumped;
  }

  onGroundAgain() {
    if (this.y >= 150) {
      this.thisJumped = false;
    }
  }

  /**
   *
   * @returns true or false
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Checks the collisions
   * @param {object} mo
   * @returns
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
