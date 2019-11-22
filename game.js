var config = {
    width: 256,
    height: 272,
    backgroundColor: 0x000000,
    scene: [Scene1, Scene2],
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade:{
            debug: false
        }
    }
}

var gameSettings = {
    playerSpeed: 200,
}

window.onload = function() {
    var game = new Phaser.Game(config);
}