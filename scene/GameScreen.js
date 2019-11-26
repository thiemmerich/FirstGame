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

        if (this.cursorKeys.space.isDown) {
            if (this.player.timing == false) {
                this.player.timing = true;
                this.time.addEvent({
                    delay: 100,
                    callback: this.player.shootBeam,
                    callbackScope: this.player,
                    loop: false
                });
            }
            //this.shootBeam();
        }
    }

    movePlayer2Manager() {
        if (this.player2Cursor.A.isDown) {
            this.player2.setVelocityX(-gameSettings.playerSpeed);
        } else if (this.player2Cursor.D.isDown) {
            this.player2.setVelocityX(gameSettings.playerSpeed);
        } else {
            this.player2.setVelocityX(0);
        }

        if (this.player2Cursor.W.isDown) {
            this.player2.setVelocityY(-gameSettings.playerSpeed);
        } else if (this.player2Cursor.S.isDown) {
            this.player2.setVelocityY(gameSettings.playerSpeed);
        } else {
            this.player2.setVelocityY(0);
        }

        if (this.ctrl.isDown) {
            if (this.player2.timing == false) {
                this.player2.timing = true;
                this.time.addEvent({
                    delay: 100,
                    callback: this.player2.shootBeam,
                    callbackScope: this.player2,
                    loop: false
                });
            }
            //this.shootBeam();
        }
    }

    /*
        MAKE POWERUP DISAPEAR WHEN THE PLAYER HIT THE POWERUP
    */
    pickPowerUp(player, powerUp) {
        powerUp.disableBody(true, true);
        player.multiplier += 1;
    }

    /*
        RESET THE ENEMY AND PLAYER SHIP WHEN PLAYER HIT THE ENEMY SHIPS
    */
    hurtPlayer(player, enemy) {
        this.resetShipPos(enemy);

        if (player.alpha < 1) {
            return;
        }

        player.life -= 200;
        player.multiplier -= 1;

        if (player.life < 0) {

            var explosion = new Explosion(this, player.x, player.y);
            this.resetPlayer(player);
        }
    }

    resetPlayer(player) {
        player.x = config.width / 2 - 8;
        player.y = config.height;

        player.alpha = 0.5;

        var tween = this.tweens.add({
            targets: player,
            y: config.height - 64,
            ease: 'Power1',
            duration: 1500,
            repeat: 0,
            onComplete: function () {
                player.alpha = 1;
                player.life = 500;
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
        this.score = 0;

        this.cena = "GAMESCREEN";

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
        this.ship1 = new Ship(this, config.width / 2 - 50, config.height / 2, 100, "ship1", "ship1_anim", 2);
        this.ship2 = new Ship(this, config.width / 2, config.height / 2, 150, "ship2", "ship2_anim", 3);
        this.ship3 = new Ship(this, config.width / 2 + 50, config.height / 2, 50, "ship3", "ship3_anim", 1);

        /*
            CREATING THE PLAYER SHIP AND ENABLING COLLIDE
         */
        this.player = new Player(this, config.width / 2 - 14, config.height - 64, "player", "thrust");
        this.player2 = new Player(this, config.width / 2 + 14, config.height - 64, "player", "thrust");

        /*
            CREATING THE KEYBOARD LISTENER
         */
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.player2Cursor = this.input.keyboard.addKeys('W,S,A,D');

        /*
            CREATING THE SPACEBAR 
         */
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.ctrl = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);

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
        this.physics.add.overlap(this.player2, this.powerUps, this.pickPowerUp, null, this);

        /*
            ENABLING THE PLAYER TO COLLIDE TO A ENEMY AND MAKE DESAPEAR
         */
        this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this);
        this.physics.add.overlap(this.player2, this.enemies, this.hurtPlayer, null, this);

        /*
            ENABLING THE PROJECTILE TO COLLIDE TO A ENEMY AND DESTROY IT
         */
        this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);
    }

    /*
        METHOD UPDATE(LOOP) FROM PHASER FRAMEWORK
    */
    update() {

        this.moveShip(this.ship1, 1);
        this.moveShip(this.ship2, 2);
        this.moveShip(this.ship3, 3);

        this.background.tilePositionY -= 0.5;

        this.movePlayerManager();
        this.movePlayer2Manager();

        /*if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
            this.shootBeam();
        }*/

        for (var j = 0; j < this.projectiles.getChildren().length; j++) {
            var beam = this.projectiles.getChildren()[j];
            beam.update();
        }
    }

}