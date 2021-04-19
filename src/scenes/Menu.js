class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
    }

    create() {
        // menu configuration
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // show menu text
        this.add.text(game.config.width / 2, game.config.height / 4 - borderUISize - borderPadding,
                      'ROCKET PATROL', menuConfig).setOrigin(0.5);
        menuConfig
        this.add.text(game.config.width / 2, game.config.height / 4, 'P1: ← → arrows to move / (↑) to fire',
                      menuConfig).setOrigin(0.5);
        // ---------- 2P Mode ----------
        this.add.text(game.config.width / 2, game.config.height / 3, 'P2: A and D to move / (W) to fire',
                      menuConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 3 + borderPadding * 2 + borderPadding * 2,
                      'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);
        // ---------- Adjusts for More Instructions ----------
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = "#000";
        this.add.text(game.config.width / 2, game.config.height / 3 + borderUISize * 2 + borderPadding * 2,
                      'Press (1) for 1-Player Mode', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 3 + borderUISize * 3 + borderPadding * 2,
                      'Press (2) for 2-Player Mode', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#0000FF';
        menuConfig.color = '#FFF';
        this.playerMode = this.add.text(game.config.width / 2, game.config.height / 3 + borderUISize * 5 + borderPadding * 2,
                                        '1-Player Mode Active', menuConfig).setOrigin(0.5);
        // ---------- High Score ----------
        menuConfig.backgroundColor = '#F3B141';
        menuConfig.color = '#843605';
        this.add.text(game.config.width / 2, game.config.height / 2 + borderUISize * 5 + borderPadding * 2,
                      'HI SCORE: ' + highScore, menuConfig).setOrigin(0.5);
        

        // player modes
        this.singleplayer = true;
        this.multiplayer = false;
        
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        // define MOD keys
        keyONE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        keyTWO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
    }

    update() {
        // determine player mode
        if(Phaser.Input.Keyboard.JustDown(keyONE)) {
            this.singleplayer = true;
            this.multiplayer = false;
            this.playerMode.text = '1-Player Mode Active';
        }
        if(Phaser.Input.Keyboard.JustDown(keyTWO)) {
            this.singleplayer = false;
            this.multiplayer = true;
            this.playerMode.text = '2-Player Mode Active';
        }

        if(Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            game.settings = {
                spaceshipSpeed: 3,
                gameTimer: 60000,
                singleMode: this.singleplayer,
                multiMode: this.multiplayer
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
        
        if(Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // hard mode
            game.settings = {
                spaceshipSpeed: 4,
                gameTimer: 45000,
                singleMode: this.singleplayer,
                multiMode: this.multiplayer
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
    }
}