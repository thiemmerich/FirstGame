class GameScreen extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    /*
        MAKING THE ENEMIES SHIP MOVE DOWN
    */
    moveShip(ship, speed) {
        var xSpeed = Phaser.Math.Between(-2,2);
        ship.y += speed;
        ship.x += xSpeed;

        if (ship.y > config.height) {
            //this.resetShipPos(ship);
            this.destroyShip(ship);
        }
    }

    moveBoss(ship) {
        if (ship.x >= config.width) {
            ship.bossPosX = -1;
        }
        if (ship.x <= 0) {
            ship.bossPosX = 1;
        }
        if (ship.y >= config.height) {
            ship.bossPosY = -1;
        }
        if (ship.y <= 20) {
            ship.bossPosY = 1;
        }
        ship.x += ship.bossPosX;
        ship.y += ship.bossPosY;
    }

    /*
        RESETING THE ENEMIE SHIP POSITION TO THE TOP OF THE MAP ON A RANDOM POSITION
    */
    resetShipPos(ship) {
        var newLife = Phaser.Math.Between(100, 300);
        var randomX = Phaser.Math.Between(0, config.width);

        ship.setTexture(ship.type);
        ship.play(ship.type + "_anim");
        ship.life = newLife;
        ship.y = 0;
        ship.x = randomX;
    }

    /*
        DESTROYING SHIP
    */
    destroyShip(gameObject) {
        gameObject.setTexture("explosion");
        gameObject.play("explode");
        gameObject.destroy();
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

    movePowerUp(powerUp) {
        if (powerUp.x >= config.width) {
            powerUp.veloX = -100;
        }
        if (powerUp.x <= 0) {
            powerUp.veloX = 100;
        }
        if (powerUp.y >= config.height) {
            powerUp.veloY = -100;
        }
        if (powerUp.y <= 20) {
            powerUp.veloY = 100;
        }
        powerUp.setVelocityX(powerUp.veloX);
        powerUp.setVelocityY(powerUp.veloY);
    }

    /*
        MAKE POWERUP DISAPEAR WHEN THE PLAYER HIT THE POWERUP
    */
    pickPowerUp(player, powerUp) {
        powerUp.disableBody(true, true);
        if (powerUp.type == "red") {
            player.multiplier += 1;
        } else {
            player.life += 100;
        }
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

    hurtByBoss(player) {
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
            //this.resetShipPos(enemy);

            this.score += 15;
            this.scoreLabel.setText("SCORE " + this.score + " WAVE " + this.wave);
            this.kills += 1;
        }
    }

    createPowerUp() {
        if (Math.random() > 0.5) {
            var powerUp = new PowerUp(this, 16, 16, "power-up", "red", "red");
        } else {
            var powerUp = new PowerUp(this, 16, 16, "power-up", "gray", "gray");
        }
    }

    createEnemyShipWave(qtde, type, animation, life) {
        for (var q = 0; q < qtde; q++) {
            //var n = Phaser.Math.Between(1, 3);
            var posX = Phaser.Math.Between(0, config.width);
            this.enemies.add(new Ship(this, posX, 0, life, type, animation, type, 1));
        }
    }

    createBoss(type, animation, life, scale) {
        var boss = new Ship(this, config.width / 2, 0, life, type, animation, type, 1);
        boss.scale += scale;
        this.bosses.add(boss);
    }

    /*
        METHOD CREATE FROM PHASER FRAMEWORK
    */
    create() {
        this.scale = 1;
        this.score = 0;
        this.kills = 0;
        this.powerUpSpawn = Phaser.Math.Between(0, 10);
        this.cena = "GAMESCREEN";
        this.count = 0;
        this.wave = 1;

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

        /*
            CREATING THE ENEMIES SHIPS
        */
        this.enemies = this.physics.add.group();
        this.bosses = this.physics.add.group();

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
        this.ctrl = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

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
        this.physics.add.overlap(this.player, this.bosses, this.hurtByBoss, null, this);
        this.physics.add.overlap(this.player2, this.bosses, this.hurtByBoss, null, this);

        /*
            ENABLING THE PROJECTILE TO COLLIDE TO A ENEMY AND DESTROY IT
         */
        this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.projectiles, this.bosses, this.hitEnemy, null, this);
    }

    /*
        METHOD UPDATE(LOOP) FROM PHASER FRAMEWORK
    */
    update() {

        this.background.tilePositionY -= 0.5;

        if (this.count == 0) {
            this.createEnemyShipWave(8, "ship1", "ship1_anim", 10);
        }
        if (this.count == 700) {
            this.createEnemyShipWave(8, "ship2", "ship2_anim", 20);
            this.wave = 2;
        }
        if (this.count == 1400) {
            this.createEnemyShipWave(8, "ship3", "ship3_anim", 40);
            this.wave = 3;
        }
        if (this.count == 2100) {
            this.createEnemyShipWave(4, "ship1", "ship1_anim", 80);
            this.createEnemyShipWave(4, "ship2", "ship2_anim", 80);
            this.wave = 4;
        }
        if (this.count == 2800) {
            this.createEnemyShipWave(4, "ship1", "ship1_anim", 160);
            this.createEnemyShipWave(4, "ship2", "ship2_anim", 160);
            this.createEnemyShipWave(4, "ship3", "ship3_anim", 160);
            this.wave = 5;
        }

        if (this.count == 3500) {
            this.createBoss("ship1", "ship1_anim", 1600, 3);
        }

        this.movePlayerManager();
        this.movePlayer2Manager();

        for (var l = 0; l < this.enemies.getChildren().length; l++) {
            this.moveShip(this.enemies.getChildren()[l], 1);
        }

        for (var l = 0; l < this.bosses.getChildren().length; l++) {
            this.moveBoss(this.bosses.getChildren()[l]);
        }

        for (var j = 0; j < this.projectiles.getChildren().length; j++) {
            var beam = this.projectiles.getChildren()[j];
            beam.update();
        }

        if (this.kills == this.powerUpSpawn) {
            this.createPowerUp();
            this.powerUpSpawn = Phaser.Math.Between(this.kills, (this.kills * Phaser.Math.Between(2, 5)));
        }

        for (var k = 0; k < this.powerUps.getChildren().length; k++) {
            this.movePowerUp(this.powerUps.getChildren()[k]);
        }

        this.count++;
        //console.log(this.count);
    }

}