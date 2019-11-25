var config = {
    width: 580,
    height: 680,
    backgroundColor: 0x000000,
    scene: [TitleScreen, GameScreen],
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