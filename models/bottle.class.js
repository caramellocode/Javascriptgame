class Bottle extends MovableObject {
    height = 60;
    width = 60;
    y = 365;
    offset = {
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
    };

    IMAGES_ONGROUND = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    constructor() {
        super().loadImage(this.IMAGES_ONGROUND[0]);
        this.loadImages(this.IMAGES_ONGROUND);
        this.x = Math.random() * 2000;
        this.animate();
    }

    /**
     * Holt das aktuelle Bild für die Animation
     */
    animate() {
        setStopableInterval(this.standingBottle, 1100);
    }

    /**
     * Ruft die Funktion "playAnimation" auf, um die Bilder für die Animation zu ändern
     */
    standingBottle = () => {
        this.playAnimation(this.IMAGES_ONGROUND);
    }
}
