let snake;
let food = [];
let resolution = 20;
let greenDotScore = 0;
let redDotEaten = 0;
let additionalGreenDots = 100;
let message = "";
let messageTimeout = 0;
let greenMessages = ["Ops, you just killed a pregnant woman", "Ops, you just killed an entire family of 5 members", "Ops, you just killed a 5 months old baby", "Ops, you just killed a baby in an incubator", "Ops, you just bombed a hospital with 300 people inside", "Ops, you just bombed a school with 150 kids inside", "Ops, you just killed an old lady with her grandson"];
let redMessages = ["Ops, it turns out there are no ' 'suspicious' ' people here", "Ops, false news, nothing's here", "Ops, you killed all these people for nothing", "Ops, no ' 'terrorists' ' are here"];
let gamePaused = false;
let gameOver = false;
let noRedDotsMessage = "";
let noRedDotsMessageTimeout = 0;
let gameState = "instruction1";




function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function draw() {
  if (gameState === "gameOver") {
    displayGameOverScreen();
    return; // Stop further rendering once game is over
  }
  if (gameState === "instruction1") {
    displayInstruction1();
  } else if (gameState === "instruction2") {
    displayInstruction2();
  } else if (gameState === "gamePlay") {
    // Game play logic
    if (gameState === "gamePlay") {
    updateGameStatus();  

    if (!gamePaused) {
      updateGamePlay();
    }

    snake.show();
    displayCounts();
    displayMessage();
  }
}
  }

function mousePressed() {
  let fs = fullscreen();
  fullscreen(!fs);
}
 

function displayInstruction1() {
  background(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(0);
  text("Welcome to the Snake Game", width / 2, height / 3);
  textStyle(NORMAL); // Normal text style
 
  // Instruction Text
  textSize(16);
  let baseY = height / 3 + 60;
  let part1 = "In this game, ";
  text(part1, width / 2 - 173, baseY); // Adjust x position accordingly

  // "green" part
  fill(0, 128, 0); // Green color
  text("green", width / 2 - 105, baseY);

  // Middle part
  fill(0); // Black color for text
  let part2 = " and ";
  text(part2, width / 2 + -65, baseY);

  // "red" part
  fill(255, 0, 0); // Red color
  text("red", width / 2 + -35, baseY);

  // Last part
  fill(0); // Black color for text
  let part3 = " dots are scattered all over the screen";
  text(part3, width / 2 + 110, baseY); // Adjust x position accordingly

  // "Try always to eat the" part
  let sentencePart1 = "You win ONLY if you ate the";
  let sentencePart1Width = textWidth(sentencePart1);
  let startX = width / 2 - sentencePart1Width / 2;
  text(sentencePart1, startX, baseY + 40);
  textStyle(NORMAL); // Revert text style to normal

  // "RED" part
  fill(255, 0, 0);
  let redText = "RED";
   textStyle(BOLD); // Set text style to bold
  let redTextWidth = textWidth(redText);
  text(redText, startX -37 + sentencePart1Width, baseY + 40);
 

  // "dots only" part
  fill(0);
  let sentencePart2 = "dots..";
  textStyle(NORMAL); // Revert text style to normal
  text(sentencePart2, startX + sentencePart1Width + redTextWidth, baseY + 40);
 
 

 // Button
  fill(0);
  let buttonY = height / 2 + 60; // Increased by 20
  rect(width / 2 - 60, buttonY, 120, 40);
  fill(255);
  textSize(20);
  text("Next", width / 2, buttonY + 20); // Adjust text position to align with the button
}

function displayInstruction2() {
  background(255);
  textAlign(CENTER, CENTER);
  textSize(16);
  let baseY = height / 2.5;

  // "Green" part
  textStyle(BOLD); // Set text style to bold
  fill(0, 128, 0); // Green color
  text("Green", width / 2 - 48, baseY);

  // "= innocent" part
  textStyle(NORMAL); // Revert text style to normal
  fill(0); // Black color
  text("= innocent", width / 2 + 15, baseY);

  // "Red" part
  textStyle(BOLD); // Set text style to bold
  fill(255, 0, 0); // Red color
  text("Red", width / 2 - 48, baseY + 40);

  // "= not" part
  textStyle(NORMAL); // Revert text style to normal
  fill(0); // Black color
  text("= '' terrorist ''", width / 2 + 15, baseY + 40);

  // Button
  fill(0);
  let buttonY = height / 2 + 60; // Same y-coordinate as the "Next" button in displayInstruction1
  rect(width / 2 - 60, buttonY, 120, 40);
  fill(255);
  textSize(20);
  text("START", width / 2, buttonY + 20); // Adjust text position to align with the button
}





// New variables for Perlin noise
let noiseOffset = 0;
const noiseIncrement = 0.1;

function drawFood() {
  food.forEach(f => {
    fill(f.color === 'red' ? color(255, 0, 0) : color(0, 255, 0));
    rect(f.position.x, f.position.y, resolution, resolution);
  });
}



function resetGame() {
    snake = new Snake();
  frameRate(5);
  food = [];
  greenDotScore = 0;
  redDotEaten = 0;
  gamePaused = false;
  gameOver = false;
  placeRedFoodWithGreenSurrounding();
  scatterAdditionalGreenDots();
}


function updateGameStatus() {
  if (gamePaused && millis() > messageTimeout) {
    gamePaused = false; // Resume the game after message timeout
    message = "";  	 // Clear the message
  }
}



function updateGamePlay() {
  background(255);
  drawFood();
  snake.update();

  if (gameOver) {
    gameState = "gameOver"; // Set the game state to gameOver
    displayGameOverScreen();
    noLoop();
    return;
  }

  if (snake.eat(food)) {
    updateCountsAndMessage();
  }
}

function displayGameOverScreen() {
  background(255); // Set a background color for the game over screen
  fill(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("GAME OVER", width / 2, height / 3);

  // Display scores
  textSize(24);
  fill(0, 255, 0); // Green color for green dots score
  text("Green Dots: " + greenDotScore, width / 2, height / 2);

  fill(255, 0, 0); // Red color for red dots score
  text("Red Dots: " + redDotEaten, width / 2, height / 2 + 40);

  // Draw "Start Over" button
  fill(255, 0, 0); // Red background for the button
  rect(width / 2 - 60, height / 2 + 100, 120, 40);
  fill(0); // Black font color
  textSize(16);
  text("Start Over", width / 2, height / 2 + 120);
}


function displayStartScreen() {
  background(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(0);
  text("The Snake Game", width / 2, height / 3);

  textSize(16);
  text("Try to eat the red dots only", width / 2, height / 3 + 40);

  fill(0);
  rect(width / 2 - 60, height / 2 + 20, 120, 40);
  fill(255);
  textSize(20);
  text("START", width / 2, height / 2 + 40);
}

function mousePressed() {
    let buttonX = width / 2 - 60;
    let buttonWidth = 120;
    let buttonHeight = 40;

    if (gameState === "instruction1") {
   	 let buttonY = height / 2 + 60; // Button Y coordinate for instruction1
   	 if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
   		 mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
   		 gameState = "instruction2";
   	 }
    } else if (gameState === "instruction2") {
   	 let buttonY = height / 2 + 60; // Button Y coordinate for instruction2
   	 if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
   		 mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
   		 gameState = "gamePlay";
   		 resetGame();
   		 loop(); // Restart the game loop if it was stopped
   	 }
    } else if (gameState === "gameOver") {
   	 let buttonY = height / 2 + 100; // Button Y coordinate for "Start Over" button
   	 if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
   		 mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
   		 resetGame(); // Reset the game to its initial state
   		 gameState = "instruction1"; // Change the game state to the start or instruction screen
   		 loop(); // Ensure the game loop is running
   	 }
    }
}



function scatterAdditionalGreenDots() {
  for (let i = 0; i < additionalGreenDots; i++) {
    let pos = createVector(floor(random(width / resolution)), floor(random(height / resolution)));
    pos.mult(resolution);
    food.push({ position: pos, color: 'green' });
  }
}

function placeRedFoodWithGreenSurrounding() {
  let cols = floor(width / resolution);
  let rows = floor(height / resolution);

  for (let i = 0; i < 5; i++) {
    let redPos = createVector(floor(random(cols)), floor(random(rows)));
    redPos.mult(resolution);
    food.push({ position: redPos, color: 'red' });

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
   	 if (dx === 0 && dy === 0) continue;
   	 let greenPos = createVector(redPos.x + dx * resolution, redPos.y + dy * resolution);
   	 if (greenPos.x >= 0 && greenPos.y >= 0 && greenPos.x < width && greenPos.y < height) {
 		 food.push({ position: greenPos, color: 'green' });
   	 }
      }
    }
  }
}

function updateCountsAndMessage() {
  let head = snake.body[snake.body.length - 1];
  for (let i = food.length - 1; i >= 0; i--) {
    let f = food[i];
    if (head.x === f.position.x && head.y === f.position.y) {
      snake.grow();
      if (f.color === 'green') {
   	 greenDotScore = Math.round(greenDotScore * 1.2) - 1;
   	 message = random(greenMessages);
   	 messageTimeout = millis() + 2000;
      } else if (f.color === 'red') {
   	 redDotEaten++;
   	 message = random(redMessages);
   	 gamePaused = true;
   	 messageTimeout = millis() + 2000;  // Set the timeout for 2 seconds later
      }
      food.splice(i, 1);
    }
  }
}


function displayCounts() {
  fill(0);
  textSize(16);

  text("Red Dots: +" + redDotEaten, width - 70, height - 40);
   // Displaying the "Green Dots" score
  let greenScoreText = "Green Dots: " + greenDotScore;
  text(greenScoreText, 90, height - 40);

 
}


function displayMessage() {
    let displayText = "";

    // Check if the "no red dots" message should be displayed
    if (noRedDotsMessage !== "" && millis() < noRedDotsMessageTimeout) {
   	 displayText = noRedDotsMessage;
    } else if (message !== "" && millis() < messageTimeout) {
   	 // If no "no red dots" message, display any other game message
   	 displayText = message;
    }

    // Display the message if there is one
    if (displayText !== "") {
   	 fill(255, 0, 0); // Red color for text
   	 textSize(16);
   	 textStyle(BOLD);
   	 textAlign(CENTER, CENTER); // Center align the text

   	 let messageWidth = textWidth(displayText);
   	 let messageX = width / 2;
   	 let messageY = height - 20;

   	 fill(0); // Black background for text
   	 rect(messageX - messageWidth / 2 - 5, height - 35, messageWidth + 10, 25);

   	 fill(255, 0, 0); // Red color for text
   	 text(displayText, messageX, messageY);
    }
}



function keyPressed() {
  if (keyCode === UP_ARROW) {
    snake.setDir(0, -1);
  } else if (keyCode === DOWN_ARROW) {
    snake.setDir(0, 1);
  } else if (keyCode === RIGHT_ARROW) {
    snake.setDir(1, 0);
  } else if (keyCode === LEFT_ARROW) {
    snake.setDir(-1, 0);
  }
}

class Snake {
    constructor() {
   	 this.body = [];
   	 this.body[0] = createVector(floor(width / 2), floor(height / 2));
   	 this.xdir = 0;
   	 this.ydir = 0;
   	 this.len = 1;
    }

    setDir(x, y) {
   	 // Prevent the snake from reversing on itself
   	 if (this.xdir === -x && this.ydir === -y) {
   		 return;
   	 }
   	 this.xdir = x;
   	 this.ydir = y;
    }
 
  grow() {
   	 let head = this.body[this.body.length - 1].copy();
   	 this.len++;
   	 this.body.push(head);
    }

    update() {
   	 let head = this.body[this.body.length - 1].copy();
   	 this.body.shift();

   	 head.x += this.xdir * resolution;
   	 head.y += this.ydir * resolution;

   	 // Check for boundary collision
   	 if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) {
   		 gameOver = true;
   		 return;
   	 }

   	 // Check for self-collision
   	 for (let part of this.body) {
   		 if (part.x === head.x && part.y === head.y) {
       		 gameOver = true;
       		 return;
   		 }
   	 }

   	 this.body.push(head);
    }

    endGame() {
   	 // Check if the snake's body has at least one segment
   	 if (this.body.length > 0) {
   		 let head = this.body[this.body.length - 1];
   		 // Check for boundary collision
   		 return head.x < 0 || head.x >= width || head.y < 0 || head.y >= height;
   	 }
   	 return false;
    }


    eat(foodArray) {
  if (this.body.length === 0) {
    return false; // Return false immediately if the snake has no segments
  }

  let head = this.body[this.body.length - 1];
  for (let i = 0; i < foodArray.length; i++) {
    let f = foodArray[i];
    if (head.x === f.position.x && head.y === f.position.y) {
      return true;
    }
  }
  return false;
}

    show() {
   	 fill(0);
   	 for (let i = 0; i < this.body.length; i++) {
   		 noStroke();
   		 rect(this.body[i].x, this.body[i].y, resolution, resolution);
   	 }
    }
  }