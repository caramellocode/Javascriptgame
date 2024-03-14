class Level extends MovableObject{
    enemies;
    clouds;
    coins;
    bottles;
    backgroundObjects;
    level_end_x = 2400; 

    constructor(enemies, clouds, coins, bottle, backgroundObjects){
        super().enemies = enemies;
        this.clouds = clouds;
        this.coins = coins;
        this.bottles = bottle;
        this.backgroundObjects = backgroundObjects;
    }
}