class PowerUp extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, objectName, animation, type) {

        super(scene, x, y, objectName);
        
        scene.add.existing(this);
        scene.physics.world.enableBody(this);

        this.type = type;
        this.veloX = 100;
        this.veloY = 100;
        
        this.setRandomPosition(0, 0, config.width, config.height);
        this.play(animation);

        scene.powerUps.add(this);
    }

}