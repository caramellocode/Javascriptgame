class StatusBar extends DrawableObject {
  // Array of image paths for the statusbar

  IMAGES = [
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
  ];

  percentage = 100;

  /**
   * Initializes the StatusBar with default properties, loads images for the health bar,
   * sets its position, dimensions, and health percentage to full.
   */
  constructor() {
    super().loadImages(this.IMAGES);
    this.x = 20;
    this.y = 20;
    this.width = 200;
    this.height = 60;
    this.setPercentage(100);
  }
}
