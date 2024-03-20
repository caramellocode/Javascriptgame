class Character extends MovableObject {
    height = 300;
    width = 210;
    y = 90;
    speed = 5;
    lastMove = 100;
    offset = {
        top: 5,
        left: 20,
        right: 20,
        bottom: 5,
    };
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_DEATH = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png'
    ];

    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png',
    ];

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png',
    ];

    IMAGES_SLEEPING = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    IMAGES_GAMEOVER = [
        'img/9_intro_outro_screens/game_over/oh no you lost!.png',
    ];

    world;
    walking_sound = new Audio('audio/running.mp3');
    hurt_sound = new Audio('audio/hurt.wav');
    canJump = false;
    soundsAreNew = true;

    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEATH);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_GAMEOVER);
        this.loadImages(this.IMAGES_SLEEPING);
        this.applyGravity();
        this.animate();
        this.pushCharacterSoundsInArray()
    }

   
    getLastMove() {
        this.lastMove = new Date().getTime();
    }

    /**
     * 
     * @returns 
     */
    checklastMove() {
        let timepassed = new Date().getTime() - this.lastMove;
        timepassed = timepassed / 1000;
        return timepassed > 2;
    }

    /**
     * 
     * @returns 
     */
    checkSleeping() {
        let timepassed = new Date().getTime() - this.lastMove;
        timepassed = timepassed / 1000;
        return timepassed > 4;
    }

   
    animate() {
        setStopableInterval(this.walking, 1000 / 60);
        setStopableInterval(this.walkAnimation, 150);
    }

   
    walking = () => {
        this.walking_sound.pause();

        if (this.world.keyboard.RIGHT && this.worldRightEnd())
            this.moveCharacterRight();

        if (this.world.keyboard.LEFT && this.worldLeftEnd())
            this.moveCharacterLeft();

        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
        }

        this.world.camera_x = -this.x + 100;
    }

   
    walkAnimation = () => {
        if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
            this.hurt_sound.play();
        } else if (this.isAboveGround()) {
            this.jumpAnimation();
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
        } else if (this.checkSleeping()) {
            this.playAnimation(this.IMAGES_SLEEPING);
        } else if (this.checklastMove()) {
            this.playAnimation(this.IMAGES_IDLE);
        } else {
            this.loadImage('img/2_character_pepe/2_walk/W-21.png');
        }
    }

    
    moveCharacterRight() {
        this.moveRight();
        this.otherDirection = false;
        this.getLastMove();
        this.walking_sound.play();
    }

   
    jumpAnimation() {
        this.playAnimation(this.IMAGES_JUMPING);
    }

    
    moveCharacterLeft() {
        this.moveleft();
        this.otherDirection = true;
        this.getLastMove();
        this.walking_sound.play();
    }

    /**
     * @returns 
     */
    worldRightEnd() {
        return this.x < this.world.level.level_end_x;
    }

    /**
     * @returns 
     */
    worldLeftEnd() {
        return this.x > 0;
    }

   
    pushCharacterSoundsInArray() {
        if (this.soundsAreNew) {
            sounds.push(this.walking_sound);
            sounds.push(this.hurt_sound);
            this.soundsAreNew = false;
        }
    }
}
