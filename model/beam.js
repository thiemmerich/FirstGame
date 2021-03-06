class Beam extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y) {

        //var x = scene.player.x;
        //var y = scene.player.y;

        super(scene, x, y, "beam");
        scene.add.existing(this);

        this.hit = 10;

        this.play("beam_anim");
        scene.physics.world.enableBody(this);
        this.body.velocity.y = -250;

        scene.projectiles.add(this);
    }

    update() {
        if(this.y < 36){
            this.destroy();
        }
    }
}