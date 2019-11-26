class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, objectName, animation) {

        super(scene, x, y, objectName);
        this.scene = scene;
        
        scene.add.existing(this);
        scene.physics.world.enableBody(this);

        this.life = 500;
        this.timing = false;
        this.multiplier = 1;

        this.play(animation);
        this.setCollideWorldBounds(true);
    }

    /*
        CREATING THE BEAM(PROJECTILE) OBJECT
    */
    shootBeam() {

        var x = this.x;
        var y = this.y;

        if (this.multiplier <= 1) {
            this.multiplier = 1;
            x = x + 6;
        }
        if (this.multiplier == 2) {
            x = x + 9;
        }
        if (this.multiplier == 3) {
            x = x + 12;
        }
        if (this.multiplier == 4) {
            x = x + 15;
        }
        if (this.multiplier == 5) {
            x = x + 18;
        }
    
        for (var k = 1; k <= this.multiplier; k++) {
            var beam = new Beam(this.scene, x - (k * 6), y);
        }

        this.timing = false;

    }
}