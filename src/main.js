// Game Configuration
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
let starSpeed = 4;

// reserve keyboard bindings
let keyR, keyLEFT, keyRIGHT, keyUP, keyA, keyD, keyW, keyONE, keyTWO;

// ------------------------- CMPM 120 Rocket Patrol Comments ------------------------- //
// Ivan Martinez-Arias
// Rocket Patrol Mods
//
// ----- Time -----
// Allow the player to control the Rocket after it's fired (5):     5 minutes
// Implement a simultaneous two-player mode (30):                   6 Hours
