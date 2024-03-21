class DrawableObject {
  x = 120;
  y = 280;
  img;
  height = 150;
  width = 100;
  imageCache = {};
  currentImage = 0;

  /**
   * Draws the current image of the object on the canvas.
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Optionally draws a frame around the object for debugging purposes.
   */
  drawFrame(ctx) {
    if (
      this instanceof Character ||
      this instanceof Chicken ||
      this instanceof Coins ||
      this instanceof Bottle ||
      this instanceof Endboss
    ) {
      ctx.beginPath();
      ctx.lineWidth = "5";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

  /**
   * Loads a single image from a given path.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Preloads a set of images given an array of paths and stores them in an image cache.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Sets the current image based on the object's percentage value, useful for status bars or loading screens.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Determines the correct image index to use based on the object's percentage value.
   */
  resolveImageIndex() {
    if (this.percentage >= 100 || this.percentage >= 81) {
      return 5;
    } else if (this.percentage == 80 || this.percentage >= 61) {
      return 4;
    } else if (this.percentage == 60 || this.percentage >= 41) {
      return 3;
    } else if (this.percentage == 40 || this.percentage >= 21) {
      return 2;
    } else if (this.percentage == 20 || this.percentage >= 1) {
      return 1;
    } else {
      return 0;
    }
  }
}
