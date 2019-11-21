class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    moveShip(ship, speed) {
        ship.y += speed;
        if (ship.y > config.height) {
            this.resetShipPos(ship);
        }
    }

    resetShipPos(ship) {
        this.newRandomShip(ship);
        ship.y = 0;
        var randomX = Phaser.Math.Between(0, config.width);
        ship.x = randomX;
    }

    newRandomShip(ship) {
        var newShip = Phaser.Math.Between(1, 3);
        ship.setTexture("ship" + newShip);
        ship.play("ship" + newShip + "_anim");
    }

    destroyShip(pointer, gameObject) {
        gameObject.setTexture("explosion");
        gameObject.play("explode");

        this.score += 1;
        this.resetShipPos(gameObject);
    }

    pulsingShip(ship, scaleMin, scaleMax) {
        this.scale += (0.05 * this.multiplyer);
        ship.setScale(this.scale);
        if (this.scale >= scaleMax) {
            this.multiplyer = -1;
        }
        if (this.scale <= scaleMin) {
            this.multiplyer = 1;
        }
    }

    showScore() {
        this.add.text(20, 20, "Score: " + this.score, {
            font: "12px Verdana",
            fill: "yellow"
        });
    }

    create() {
        this.scale = 1;
        this.multiplyer = 1;
        this.score = 0;

        this.showScore();

        //this.background = this.add.image(0,0,"background");
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0, 0);

        //this.ship1 = this.add.image(config.width/2 - 50, config.height/2, "ship");
        //this.ship2 = this.add.image(config.width/2, config.height/2, "ship2");
        //this.ship3 = this.add.image(config.width/2 + 50, config.height/2, "ship3");

        /*this.add.text(20, 20, "Score: " + this.score, {
            font: "12px Verdana",
            fill: "yellow"
        });*/

        this.anims.create({
            key: "red",
            frames: this.anims.generateFrameNumbers("power-up", {
                start: 0,
                end: 1
            }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "gray",
            frames: this.anims.generateFrameNumbers("power-up", {
                start: 2,
                end: 3
            }),
            frameRate: 20,
            repeat: -1
        });

        this.powerUps = this.physics.add.group();

        var maxObjects = 4;

        for (var value = 0; value <= maxObjects; value++) {
            var powerUp = this.physics.add.sprite(16, 16, "power-up");
            this.powerUps.add(powerUp);
            powerUp.setRandomPosition(0, 0, config.width, config.height);

            if(Math.random() > 0.5){
                powerUp.play("red");
            } else {
                powerUp.play("gray");
            }

            powerUp.setVelocity(100,100);
            powerUp.setCollideWorldBounds(true);
            powerUp.setBounce(1);
        }

        this.ship1 = this.add.sprite(config.width / 2 - 50, config.height / 2, "ship1");
        this.ship2 = this.add.sprite(config.width / 2, config.height / 2, "ship2");
        this.ship3 = this.add.sprite(config.width / 2 + 50, config.height / 2, "ship3");

        this.anims.create({
            key: "ship1_anim",
            frames: this.anims.generateFrameNumbers("ship1"),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "ship2_anim",
            frames: this.anims.generateFrameNumbers("ship2"),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "ship3_anim",
            frames: this.anims.generateFrameNumbers("ship3"),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
        });

        this.ship1.play("ship1_anim");
        this.ship2.play("ship2_anim");
        this.ship3.play("ship3_anim");

        this.ship1.setInteractive();
        this.ship2.setInteractive();
        this.ship3.setInteractive();

        this.input.on('gameobjectdown', this.destroyShip, this);
    }

    update() {

        this.showScore();

        this.moveShip(this.ship1, 2);
        this.moveShip(this.ship2, 3);
        this.moveShip(this.ship3, 1);

        //this.pulsingShip(this.ship1, 2, 2.5);

        this.background.tilePositionY -= 0.5;
    }
}