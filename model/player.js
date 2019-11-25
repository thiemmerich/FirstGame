class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, shipName, shipAnim) {
        
        super(scene,x,y,shipName);

        scene.add.existing(this);

        this.life = 500;

        this.play(shipAnim);
        scene.physics.world.enableBody(this);
        this.setCollideWorldBounds(true);
    }
}