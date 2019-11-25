class GameScreen extends Phaser.Scene {
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
        var newLife = Phaser.Math.Between(100, 300);
        ship.setTexture("ship" + newShip);
        ship.play("ship" + newShip + "_anim");
        ship.life = newLife;
    }

    /*
        DESTROYING SHIP
    */
    destroyShip(gameObject) {
        gameObject.setTexture("explosion");
        gameObject.play("explode");
    }

    /*pulsingShip(ship, scaleMin, scaleMax) {
        this.scale += (0.05 * this.multiplyer);
        ship.setScale(this.scale);
        if (this.scale >= scaleMax) {
            this.multiplyer = -1;
        }
        if (this.scale <= scaleMin) {
            this.multiplyer = 1;
        }
    }*/

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
        var x = this.player.x;
        var y = this.player.y;

        if (this.multiplyer <= 1) {
            this.multiplyer = 1;
            x = x + 6;
        }
        if (this.multiplyer == 2) {
            x = x + 9;
        }
        if (this.multiplyer == 3) {
            x = x + 12;
        }
        if (this.multiplyer == 4) {
            x = x + 15;
        }
        if (this.multiplyer == 5) {
            x = x + 18;
        }

        for (var k = 1; k <= this.multiplyer; k++) {
            var beam = new Beam(this, x - (k * 6), y);
        }
    }

    /*
        MAKE POWERUP DISAPEAR WHEN THE PLAYER HIT THE POWERUP
    */
    pickPowerUp(player, powerUp) {
        powerUp.disableBody(true, true);
        this.multiplyer += 1;
    }

    /*
        RESET THE ENEMY AND PLAYER SHIP WHEN PLAYER HIT THE ENEMY SHIPS
    */
    hurtPlayer(player, enemy) {
        this.resetShipPos(enemy);

        if (this.player.alpha < 1) {
            return;
        }

        this.player.life -= 200;

        if (this.player.life < 0) {

            var explosion = new Explosion(this, player.x, player.y);
            this.resetPlayer();
            player.x = config.width / 2 - 8;
            player.y = config.height - 64;
            this.multiplyer -= 1;
            this.player.life = 500;
        }
    }

    resetPlayer() {
        this.player.x = config.width / 2 - 8;
        this.player.y = config.height;
        this.multiplyer -= 1;

        this.player.alpha = 0.5;

        var tween = this.tweens.add({
            targets: this.player,
            y: config.height - 64,
            ease: 'Power1',
            duration: 1500,
            repeat: 0,
            onComplete: function () {
                this.player.alpha = 1;
            },
            callbackScope: this
        });
    }

    /*
        RESET THE ENEMY SHIP WHEN PLAYER HIT THE ENEMY SHIPS WITH BEAM
    */
    hitEnemy(projectile, enemy) {
        projectile.destroy();

        enemy.life -= projectile.hit;
        if (enemy.life < 0) {
            var explosion = new Explosion(this, enemy.x, enemy.y);
            this.destroyShip(enemy);
            this.resetShipPos(enemy);

            this.score += 15;
            this.scoreLabel.setText("SCORE " + this.score);

        }
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

        this.enemies = this.physics.add.group();
        this.ship1 = new Ship(this, config.width / 2 - 50, config.height / 2, 100, "ship1", "ship1_anim", 2);//this.add.sprite(config.width / 2 - 50, config.height / 2, "ship1");
        this.ship2 = new Ship(this, config.width / 2, config.height / 2, 150, "ship2", "ship2_anim", 3);//this.add.sprite(config.width / 2, config.height / 2, "ship2");
        this.ship3 = new Ship(this, config.width / 2 + 50, config.height / 2, 50, "ship3", "ship3_anim", 1);//this.add.sprite(config.width / 2 + 50, config.height / 2, "ship3");

        /*
            WHEN WE CLICK ON THE ENEMY IT BE DESTROYED
         */
        //this.input.on('gameobjectdown', this.destroyShip, this);

        /*
            CREATING THE PLAYER SHIP AND ENABLING COLLIDE
         */
        this.player = new Player(this, config.width / 2 - 8, config.height - 64, "player", "thrust");
        //this.player = this.physics.add.sprite(config.width / 2 - 8, config.height - 64, "player");
        //this.player.setCollideWorldBounds(true);
        //this.player.play("thrust");
        //this.life = 500;

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