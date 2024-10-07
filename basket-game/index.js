const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000',
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let basket;
let cursors;
let food;
let foodGroup;
let foodSpeed = 100;
let score = 0;
let scoreText;
let foodTimer; // Timer reference for spawning food

const game = new Phaser.Game(config);

function preload() {
    this.load.image('food', './assets/food.png');  
    this.load.image('board', './assets/board1.png');
    this.load.image('basket', './assets/basket.png');
}

function create() {
    const board = this.add.image(400, 300, 'board'); 
    board.setOrigin(0.5, 0.5);

    basket = this.physics.add.sprite(400, 600, 'basket');
    basket.setOrigin(0.5, 0.5);
    basket.setCollideWorldBounds(true);  
    basket.setScale(0.2);

    foodGroup = this.physics.add.group();

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(basket, foodGroup, catchFood, null, this);

    scoreText = this.add.text(10, 30, 'Score: ' + score, { font: "bold 22px Arial", fill: '#fff' });

    // Create a timer for spawning food
    foodTimer = this.time.addEvent({
        delay: 1000,  
        callback: spawnFood,
        callbackScope: this,
        loop: true
    });
}

function update() {
    // Check if cursors is defined before trying to access its properties
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
        if (foodItem.y > 600) {
            foodItem.destroy();  
        }
    }, this);
}

function spawnFood() {
    const x = Phaser.Math.Between(50, 750);
    food = foodGroup.create(x, -10, 'food');  
    food.setVelocityY(foodSpeed);           
    food.setScale(0.1);                    
}

function catchFood(basket, food) {
    score += 1;
    scoreText.setText('Score: ' + score);
    food.destroy();  

    // Check for the win condition
    if (score === 10) {
        foodGroup.clear(true, true); 
        foodSpeed = 0; 
        foodTimer.paused = true; 

        console.log("You win the match!");
        WinningText = this.add.text(250, 300, "You win the match!", { font: "bold 32px Arial", fill: '#000' });
        game.scene.pause(); 

        basket.setVelocityX(0);
        cursors = null; 
    }
}