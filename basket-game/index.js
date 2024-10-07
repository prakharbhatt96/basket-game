const config = {
    type: Phaser.AUTO,
    width: window.innerWidth, 
    height: window.innerHeight, 
    backgroundColor: '#000',
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        mode: Phaser.Scale.FIT, 
        autoCenter: Phaser.Scale.CENTER_BOTH 
    }
};

let basket;
let cursors;
let food;
let foodGroup;
let foodSpeed = 100;
let score = 0;
let scoreText;
let foodTimer; 

const game = new Phaser.Game(config);

function preload() {
    this.load.image('food', './assets/food.png');  
    this.load.image('board', './assets/board1.png');
    this.load.image('basket', './assets/basket.png');
}

function create() {
    
    const board = this.add.image(config.width / 2, config.height / 2, 'board'); 
    board.setOrigin(0.5, 0.5);

  
    const boardAspectRatio = board.width / board.height; 
    const gameAspectRatio = config.width / config.height;

    if (boardAspectRatio > gameAspectRatio) {
      
        board.setDisplaySize(config.width, config.width / boardAspectRatio);
    } else {
        
        board.setDisplaySize(config.height * boardAspectRatio, config.height);
    }

    basket = this.physics.add.sprite(config.width / 2, config.height - 50, 'basket'); 
    basket.setOrigin(0.5, 0.5);
    basket.setCollideWorldBounds(true);  
    basket.setScale(0.2);

    foodGroup = this.physics.add.group();

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(basket, foodGroup, catchFood, null, this);

    scoreText = this.add.text(10, 10, 'Score: ' + score, { font: "bold 22px Arial", fill: '#fff' }); 
    foodTimer = this.time.addEvent({
        delay: 1000,  
        callback: spawnFood,
        callbackScope: this,
        loop: true
    });
}


function update() {
    if (cursors) {
        if (cursors.left.isDown) {
            basket.setVelocityX(-300); 
        } else if (cursors.right.isDown) {
            basket.setVelocityX(300);   
        } else {
            basket.setVelocityX(0);     
        }
    }

    foodGroup.children.each(function(foodItem) {
        if (foodItem.y > config.height) { 
            foodItem.destroy();  
        }
    }, this);
}

function spawnFood() {
    const x = Phaser.Math.Between(50, config.width - 50); 
    food = foodGroup.create(x, -10, 'food');  
    food.setVelocityY(foodSpeed);           
    food.setScale(0.1);                    
}

function catchFood(basket, food) {
    score += 1;
    scoreText.setText('Score: ' + score);
    food.destroy();  
    if (score === 10) {
        foodGroup.clear(true, true); 
        foodSpeed = 0; 
        foodTimer.paused = true; 

        console.log("You win the match!");
        WinningText = this.add.text(config.width / 2 - 100, config.height / 2, "You win the match!", { font: "bold 32px Arial", fill: '#000' }); 
        game.scene.pause(); 

        basket.setVelocityX(0);
        cursors = null; 
    }
}

window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
