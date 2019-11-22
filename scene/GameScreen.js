class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    /*
        MAKING THE ENEMIES SHIP MOVE DOWN
    */
    moveShip(ship, speed) {
        ship.y += speed;
        if (ship.y > config.height) {
            this.resetShipPos(ship);
        }
    }

    /*
        RESETING THE ENEMIE SHIP POSITION TO THE TOP OF THE MAP ON A RANDOM POSITION
    */
    resetShipPos(ship) {
        this.newRandomShip(ship);
        ship.y = 0;
        var randomX = Phaser.Math.Between(0, config.width);
        ship.x = randomX;
    }

    /*
        SHOWING THE ENEMIE SHIP WITH A RANDOM SPRITE
    */
    newRandomShip(ship) {
        var newShip = Phaser.Math.Between(1, 3);
        ship.setTexture("ship" + newShip);
        ship.play("ship" + newShip + "_anim");
    }

    /*
        DESTROYING SHIP
    */
    destroyShip(gameObject) {
        gameObject.setTexture("explosion");
        gameObject.play("explode");
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

    /*
        SETTING THE PLAYER MOVES
    */
    movePlayerManager() {
        if (this.cursorKeys.left.isDown) {
            this.player.setVelocityX(-gameSettings.playerSpeed);
        } else if (this.cursorKeys.right.isDown) {
            this.player.setVelocityX(gameSettings.playerSpeed);
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursorKeys.up.isDown) {
            this.player.setVelocityY(-gameSettings.playerSpeed);
        } else if (this.cursorKeys.down.isDown) {
            this.player.setVelocityY(gameSettings.playerSpeed);
        } else {
            this.player.setVelocityY(0);
        }
    }

    /*
        CREATING THE BEAM(PROJECTILE) OBJECT
    */
    shootBeam() {
        var beam = new Beam(this);
    }

    /*
        MAKE POWERUP DISAPEAR WHEN THE PLAYER HIT THE POWERUP
    */
    pickPowerUp(player, powerUp) {
        powerUp.disableBody(true, true);
    }

    /*
        RESET THE ENEMY AND PLAYER SHIP WHEN PLAYER HIT THE ENEMY SHIPS
    */
    hurtPlayer(player, enemy) {
        this.resetShipPos(enemy);
        player.x = config.width / 2 - 8;
        player.y = config.height - 64;
    }

    /*
        RESET THE ENEMY SHIP WHEN PLAYER HIT THE ENEMY SHIPS WITH BEAM
    */
    hitEnemy(projectile, enemy) {
        projectile.destroy();
        this.destroyShip(enemy);
        this.resetShipPos(enemy);

        this.score += 15;
        this.scoreLabel.setText("SCORE " + this.score);
    }

    /*
        METHOD CREATE FROM PHASER FRAMEWORK
    */
    create() {
        this.scale = 1;
        this.multiplyer = 1;
        this.score = 0;

        /*
            CREATING THE MAP AND SETTING THIS ORIGIN
         */
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0, 0);

        /*
            CREATING THE SCORE PANEL
         */
        var graphics = this.add.graphics();
        graphics.fillStyle("Black");
        graphics.fillRect(0, 0, config.width, 20);

        this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE ", 16);

        /*
            CREATING THE POWERUP OBJECTS
         */

        this.powerUps = this.physics.add.group();

        var maxObjects = 4;

        for (var value = 0; value <= maxObjects; value++) {
            var powerUp = this.physics.add.sprite(16, 16, "power-up");
            this.powerUps.add(powerUp);
            powerUp.setRandomPosition(0, 0, config.width, config.height);

            if (Math.random() > 0.5) {
                powerUp.play("red");
            } else {
                powerUp.play("gray");
            }

            powerUp.setVelocity(100, 100);
            powerUp.setCollideWorldBounds(true);
            powerUp.setBounce(1);
        }

        /*
            CREATING THE ENEMIES SHIPS
        */
        this.ship1 = this.add.sprite(config.width / 2 - 50, config.height / 2, "ship1");
        this.ship2 = this.add.sprite(config.width / 2, config.height / 2, "ship2");
        this.ship3 = this.add.sprite(config.width / 2 + 50, config.height / 2, "ship3");

        this.ship1.play("ship1_anim");
        this.ship2.play("ship2_anim");
        this.ship3.play("ship3_anim");

        //this.ship1.setInteractive();
        //this.ship2.setInteractive();
        //this.ship3.setInteractive();

        this.enemies = this.physics.add.group();
        this.enemies.add(this.ship1);
        this.enemies.add(this.ship2);
        this.enemies.add(this.ship3);

        /*
            WHEN WE CLICK ON THE ENEMY IT BE DESTROYED
         */
        this.input.on('gameobjectdown', this.destroyShip, this);

        /*
            CREATING THE PLAYER SHIP AND ENABLING COLLIDE
         */
        this.player = this.physics.add.sprite(config.width / 2 - 8, config.height - 64, "player");
        this.player.play("thrust");
        this.player.setCollideWorldBounds(true);

        /*
            CREATING THE KEYBOARD LISTENER
         */
        this.cursorKeys = this.input.keyboard.createCursorKeys();

        /*
            CREATING THE SPACEBAR 
         */
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        /*
            CREATING THE LIST OF PROJECTILES TO ADD EACH ONE
         */
        this.projectiles = this.add.group();

        /*
            ENABLING THE PROJECTILE TO COLLIDE TO POWERUP
         */
        this.physics.add.collider(this.projectiles, this.powerUps, function (projectile, powerUp) {
            projectile.destroy();
        });

        /*
            ENABLING THE PLAYER TO COLLIDE TO POWERUP AND PICK THIS (MAKE DESAPEAR)
         */
        this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, null, this);

        /*
            ENABLING THE PLAYER TO COLLIDE TO A ENEMY AND MAKE DESAPEAR
         */
        this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this);

        /*
            ENABLING THE PROJECTILE TO COLLIDE TO A ENEMY AND DESTROY IT
         */
        this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);
    }

    /*
        METHOD UPDATE(LOOP) FROM PHASER FRAMEWORK
    */
    update() {

        this.moveShip(this.ship1, 2);
        this.moveShip(this.ship2, 3);
        this.moveShip(this.ship3, 1);

        this.background.tilePositionY -= 0.5;

        this.movePlayerManager();

        if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
            this.shootBeam();
        }

        for (var j = 0; j < this.projectiles.getChildren().length; j++) {
            var beam = this.projectiles.getChildren()[j];
            beam.update();
        }
    }

}