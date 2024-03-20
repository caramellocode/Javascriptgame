class Endboss extends MovableObject {
  height = 500;
  width = 300;
  y = -45;
  isWalking = true;
  startPosition_x = 2500;
  hurtedEndboss_sound = new Audio("audio/hurtBoss.mp3");
  deadEndboss_sound = new Audio("audio/deadEndboss.mp3");
  offset = {
    top: 0,
    left: 50,
    right: 30,
    bottom: 10,
  };
  playEndSound = true;
  soundsAreNew = true;

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  constructor() {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_WALKING);
    this.x = 2400;
    this.animate();
    this.playBossSounds();
  }

  /**
   * Ruft die Intervalle für den Endboss auf
   */
  animate() {
    setStopableInterval(this.endbossMoves, 10);
    setStopableInterval(this.animateEndboss, 200);
  }

  animateEndboss = () => {
    this.playEndbossAnimation();
    this.endbossIsDead();
  };

  /**
   * Moves the Endboss
   */
  endbossMoves = () => {
    this.moveleft();
  };

  playEndbossAnimation() {
    if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
      this.hurtedEndboss_sound.play();
    } else if (this.startPosition_x > this.x) {
      this.playAnimation(this.IMAGES_WALKING);
      if (world.space < 1000) {
        this.playAnimation(this.IMAGES_ATTACK);
      }
    } else if (this.isDead()) {
      this.deadEndboss_sound.play();
      this.playAnimation(this.IMAGES_DEAD);
      this.y += 50;
    } else {
      this.playAnimation(this.IMAGES_ALERT);
    }
  }

  endbossIsDead() {
    if (this.isDead()) {
      if (this.playEndSound) {
        this.deadEndboss_sound.play();
      }
      this.playAnimation(this.IMAGES_DEAD);
      this.y += 50;
      this.playEndSound = false;
    }
  }

  playBossSounds() {
    if (this.soundsAreNew) {
      sounds.push(this.hurtedEndboss_sound);
      sounds.push(this.deadEndboss_sound);
      this.soundsAreNew = false;
    }
  }
}
