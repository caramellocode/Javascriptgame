class Bottle extends MovableObject{

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
    ]

    constructor(){
        super().loadImage(this.IMAGES_ONGROUND[0]);
        this.loadImages(this.IMAGES_ONGROUND);
        this.x = Math.random()* 2000;
        this.animate();
    }

    /**
     * gets the current picture for playing the animation
     */
    animate(){
        setStopableInterval(this.standingBottle, 500)
    }

    /**
     * calls the function "playAnimation" for changen the images for playing the animation
     */
    standingBottle = () => {
            this.playAnimation(this.IMAGES_ONGROUND)
    }
}