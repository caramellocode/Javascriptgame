class Cloud extends MovableObject {
    y = 20;
    width = 500;
    height = 250;

    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 500;
        this.animate();
    }

    /**
     * Bewegt die Wolken nach links
     */
    animate() {
        setStopableInterval(this.moveClouds, 1000 / 25);
    }

    /**
     * Ruft die Bewegungsfunktion auf
     */
    moveClouds = () => {
        this.moveleft();
    }
}