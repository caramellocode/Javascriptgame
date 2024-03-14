class SmallChicken extends MovableObject {

    y = 350;
    speedY = 1.5;
    height = 80;
    width = 60;
    playSound = true;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png',
    ];

    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    };

    chicken_sound = new Audio('audio/chicken.mp3');
    soundsAreNew = true;

    constructor(){
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.x = 200 + Math.random()*2200;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.speed = 0.15 + Math.random() * 4;
        this.animate();
        this.pushSmallChickenSounds();
    }

    /**
     * Ruft die Intervallfunktionen auf
     */
    animate(){
        setStopableInterval(this.smallChickenMoves, 1500/60);
        setStopableInterval(this.playChickenAnimation, 200);
        setStopableInterval(this.showDeadSmallChicken, 1000/60);
    }

    /**
     * Bewegt das Hühnchen nach links
     */
    smallChickenMoves = () => {
        this.moveleft();
    }

    /**
     * Spielt die Animation für die kleinen Hühner ab
     */
    playChickenAnimation = () => {
        if (this.energy == 100) {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    showDeadSmallChicken = () => {
        if(this.energy < 100 && this.y < 500){
            this.playAnimation(this.IMAGES_DEAD);
            this.speed = 0;
            this.playChickenSound();
            this.y += this.speedY;
        }
    }
/**
 * Spielt den Sound für die Hühner ab
 */
    playChickenSound(){
        if(this.playSound){
            this.chicken_sound.play();
            this.playSound = false;
        }
    }

/**
 * Fügt den aktuellen Sound dem Sounds-Array hinzu
 */
    pushSmallChickenSounds(){
        if (this.soundsAreNew) {
            sounds.push(this.chicken_sound);
            this.soundsAreNew = false;
        }
    }
    
}
