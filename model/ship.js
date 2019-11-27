class Ship extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, life, shipName, shipAnim, type, velocity) {
        super(scene, x, y, shipName);
        scene.add.existing(this);

        this.life = life;
        this.type = type;
        this.bossPosX = 1;
        this.bossPosY = 1;

        this.play(shipAnim);
        scene.physics.world.enableBody(this);
        this.body.velocity.y = - velocity;

        //scene.enemies.add(this);
    }
}