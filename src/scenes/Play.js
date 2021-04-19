class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    // init(), preload(), create(0, update()

    preload() {
        // load images/tile sprites
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        // load MOD images
        this.load.image('player1rocket', './assets/player1Rocket.png');
        this.load.image('player2rocket', './assets/player2Rocket.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {
            frameWidth: 64,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 9
        });
    }

    create() {
        // place starfield
        this.starfield = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'starfield').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);

        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);

        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        // add rocket (player 1)
        this.p1Rocket = new Rocket(this, game.config.width / 2, game.config.height - borderUISize - borderPadding, 'player1rocket').setOrigin(0.5, 0);
        this.p1Rocket.player1Control = true;
        // Player 2 Mode
        if(game.settings.multiMode) {
            // add rocket (player 2)
            this.p2Rocket = new Rocket(this, game.config.width / 2, game.config.height - borderUISize - borderPadding, 'player2rocket').setOrigin(0.5, 0);
            // tells Rocket class player 2 has separate controls
            this.p2Rocket.player2Control = true;
        }

        // add spaceship (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4,
                                    'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2,
                                    'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 4,
                                    'spaceship', 0, 10).setOrigin(0, 0);

        // --- define keys ---
        // reset button
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        // player choice button
        keyONE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        keyTWO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        // p1 movement and shoot
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W); // shoot
        // p2 movement and shoot
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT); 
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP); // shoot

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {
                start: 0,
                end: 9,
                first: 0
            }),
            frameRate: 30
        }); 

        // initialize score
        this.p1Score = 0;

        // display score for player 1
        let p1ScoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#006600',
            color: '#FFFFFF',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.p1ScoreLeft = this.add.text(borderUISize + borderPadding,
                                       borderUISize + borderPadding * 2, this.p1Score, p1ScoreConfig);

        if(game.settings.multiMode) {
               // initializes second score if multiplayer
            this.p2Score = 0;

            let p2ScoreConfig = {
                fontFamily: 'Courier',
                fontSize: '28px',
                backgroundColor: '#660000',
                color: '#FFFFFF',
                align: 'center',
                padding: {
                    top: 5,
                    bottom: 5,
                },
                fixedWidth: 100
            }
            this.p2ScoreLeft = this.add.text(borderUISize * 5 + borderPadding,
                                             borderUISize + borderPadding * 2, this.p2Score, p2ScoreConfig);
        }
    
        // defines timer
        this.gameTimeLeft = game.settings.gameTimer;

        // display timer
        let timeConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.timeLeft = this.add.text(game.config.width - borderUISize * 4 - borderPadding,
                                      borderUISize + borderPadding * 2, this.gameTimeLeft / 1000, timeConfig);

        // GAME OVER flag
        this.gameOver = false;
        
        // 60-second play clock
        p1ScoreConfig.fixedWidth = 0;

        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            if(game.settings.multiMode) {
                if(this.p1Score > this.p2Score) {   // if player 1 wins
                    this.add.text(game.config.width / 2, game.config.height / 2 + 120, 'Player 1 WINS', p1ScoreConfig).setOrigin(0.5);
                } else if (this.p1Score < this.p2Score) {  // if player 2 wins
                    this.add.text(game.config.width / 2, game.config.height / 2 + 120, 'Player 2 WINS', p1ScoreConfig).setOrigin(0.5);
                } else {    // tie
                    this.add.text(game.config.width / 2, game.config.height / 2 + 120, 'Tie', p1ScoreConfig).setOrigin(0.5);
                }
            }
            this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', p1ScoreConfig).setOrigin(0.5);
            this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart or ← for Menu', p1ScoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= starSpeed;

        if(!this.gameOver) {
            // update rocket
            this.p1Rocket.update();
            if(game.settings.multiMode) {
                this.p2Rocket.update();
            }
            // update spaceships (x3)
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }

        // check collisions for rocket 1
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01, 1);
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02, 1);
        }
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03, 1);
        }
        // if there is a second player
        if(game.settings.multiMode) {
            // check collisions for rocket 2
            if(this.checkCollision(this.p2Rocket, this.ship01)) {
                this.p2Rocket.reset();
                this.shipExplode(this.ship01, 2);
            }
            if(this.checkCollision(this.p2Rocket, this.ship02)) {
                this.p2Rocket.reset();
                this.shipExplode(this.ship02, 2);
            }
            if(this.checkCollision(this.p2Rocket, this.ship03)) {
                this.p2Rocket.reset();
                this.shipExplode(this.ship03, 2);
            }
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if( rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.y + rocket.height > ship.y) {

            return true;
        } else {
            return false;
        }
    }

    shipExplode(ship, rocketNumber) {
        // temporarily hide ship
        ship.alpha = 0;     // makes transparent
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);    // places sprite where it was
        boom.anims.play('explode');     // plays animation
        boom.on('animationcomplete', () => {        // once animation is complete
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });
        // score add and repaint
        if(rocketNumber == 1) {
            this.p1Score += ship.points;
            this.p1ScoreLeft.text = this.p1Score;
        }
        if(rocketNumber == 2) {
            this.p2Score += ship.points;
            this.p2ScoreLeft.text = this.p2Score;
        }

        // play audio sound file
        this.sound.play('sfx_explosion');
    }

    updateTimer() {
        this.gameTimeLeft -= 16.5;
        var newTime = Math.floor(this.gameTimeLeft / 1000);
        console.log(newTime);
        this.timeLeft.text = Math.floor(this.gameTimeLeft / 1000);
    }
}