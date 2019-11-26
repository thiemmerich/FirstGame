class PowerUp extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, posX, posY, objectName, animation) {

        super(scene, x, y, objectName);

        scene.add.existing(this);
        //scene.physics.world.enableBody(this);
        this.play(animation);
        this.setRandomPosition(0, 0, posX, posY);
    }

}