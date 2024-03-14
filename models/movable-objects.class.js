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

    /**
     * Berechnet die Schwerkraft in der Welt
     */
    applyGravity(){
        setInterval(() => {
            if(this.isAboveGround() || this.speedY > 0){
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000/25);
    }

    /**
     * Überprüft den Status des beweglichen Objekts, ob es über dem Boden ist
     * @returns 
     */
    isAboveGround(){
        if(this instanceof ThrowableObject){
            return true;
        } else {
            return this.y < 120;
        }
    }

    /**
     * Bewegt das Objekt nach rechts
     */
    moveRight(){
        this.x += this.speed;
    }

    /**
     * Bewegt das Objekt nach links
     */
    moveleft(){
        this.x -= this.speed;
    }

    /**
     * Ruft das entsprechende imgArray ab und erhöht "currentImage"
     * @param {array} imgArray 
     */
    playAnimation(imgArray){
        let i = this.currentImage % imgArray.length;
        let path = imgArray[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Lässt das Objekt springen
     */
    jump(){
        this.speedY = 30;
    }

    /**
     * Trifft das Objekt und reduziert die Energie
     */
    hit(){
        this.energy -= 3;
        if(this.energy < 0){
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Setzt den Zeitpunkt für die Verletzung des Objekts
     * @returns 
     */
    isHurt(){
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000; 
        return timepassed < 0.6;
    }

    /**
     * 
     * @returns den gesunden Status
     */
    isNotHurt(){
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000; 
        return timepassed > 0.6;
    }

    /**
     * 
     * @returns den Sprungstatus
     */
    isJumped(){
        if(this.y <= 10){
            this.thisJumped = true;
        }
        return this.thisJumped;
    }

    /**
     * Gibt zurück, ob der Charakter gelandet ist
     */
    onGroundAgain(){
        if(this.y >= 150){
            this.thisJumped = false;
        }
    }

    /**
     * Überprüft den Energiestatus und
     * @returns true oder false
     */
    isDead(){
        return this.energy == 0;
    }

    /**
     * Überprüft die Kollision für Objekte
     * @param {object} mo 
     * @returns true, wenn eine Kollision stattgefunden hat
     */
    isColliding(mo){
        return  this.x + this.width - this.offset.right > mo.x + mo.offset.left && 
                this.y + this.height - this.offset.bottom > mo.y + mo.offset.top && 
                this.x + this.offset.left < mo.x + mo.width - mo.offset.right && 
                this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }
}
