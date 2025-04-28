const canvas = document.querySelector("#canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.backgroundImage = "url(images/background.png)";

const context = canvas.getContext("2d");

const hills = new Image();
hills.src = 'images/hills.png';

let platforms = [];
let gravity = 0.7;
let offset = -4;

// Platform class
class Platform {
  constructor(x, y, width, height, imgSrc) {
    this.positionx = x;
    this.positiony = y;
    this.width = width;
    this.height = height;
    this.img = new Image();
    this.img.src = imgSrc;
  }
  draw() {
    context.drawImage(this.img, this.positionx, this.positiony, this.width, this.height);
  }
}

// Player class
class Player {
  constructor() {
    this.positionx = 100;
    this.positiony = 80;
    this.velocity = { x: 0, y: 1 };
    this.height = 100;
    this.width = 50;
    this.frames = 1;
    this.face = 'right';
  }
  draw() {
    if (this.velocity.x === 0 && this.velocity.y === 0 && this.face === 'right') {
      context.drawImage(playerStandRight, 177 * this.frames, 0, 177, 400, this.positionx, this.positiony, this.width, this.height);
    }
    if (this.velocity.x === 0 && this.velocity.y === 0 && this.face === 'left') {
      context.drawImage(playerStandLeft, 177 * this.frames, 0, 177, 400, this.positionx, this.positiony, this.width, this.height);
    }
    if (this.velocity.x > 0) {
      this.face = 'right';
      context.drawImage(playerRunRight, 340 * this.frames, 0, 340, 400, this.positionx, this.positiony, 100, this.height);
    }
    if (this.velocity.x < 0) {
      context.drawImage(playerRunLeft, 340 * this.frames, 0, 340, 400, this.positionx, this.positiony, 100, this.height);
      this.face = 'left';
    }
  }
  update() {
    this.frames++;
    if (this.frames === 24) {
      this.frames = 1;
    }
    this.positionx += this.velocity.x;
    this.positiony += this.velocity.y;
    this.velocity.y += gravity;

    if ((this.positiony + this.height) >= canvas.height) {
      this.positiony = canvas.height - this.height;
      this.velocity.y = 0;
    }

    // Improved collision logic
    for (let i = 0; i < platforms.length; i++) {
      const platform = platforms[i];
      if (
        this.positionx + this.width > platform.positionx &&
        this.positionx < platform.positionx + platform.width &&
        this.positiony + this.height <= platform.positiony &&
        this.positiony + this.height + this.velocity.y >= platform.positiony
      ) {
        this.velocity.y = 0;
        this.positiony = platform.positiony - this.height;
      }
    }
  }
}

let player = new Player();

// Sprites
const playerStandRight = new Image();
playerStandRight.src = 'images/spriteStandRight.png';

const playerStandLeft = new Image();
playerStandLeft.src = 'images/spriteStandLeft.png';

const playerRunRight = new Image();
playerRunRight.src = 'images/spriteRunRight.png';

const playerRunLeft = new Image();
playerRunLeft.src = 'images/spriteRunLeft.png';

playerStandRight.onload = imgLoaded();
playerStandLeft.onload = imgLoaded();
playerRunRight.onload = imgLoaded();
playerRunLeft.onload = imgLoaded();

function imgLoaded() {
  player.draw();
}

// Platforms
const platform = new Platform(0, canvas.height - 100, 400, 100, 'images/platform.png');
const platform1 = new Platform(399, canvas.height - 100, 400, 100, 'images/platform.png');
platforms.push(platform, platform1);

// Animation function
function animate() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  requestAnimationFrame(animate);
  context.drawImage(hills, 0, 0, 2000, canvas.height);

  for (let i = 0; i < platforms.length; i++) {
    platforms[i].draw();
  }
  player.update();
  player.draw();
}

animate();

// Event listeners for movement
addEventListener("keydown", function (event) {
  if (event.key === "ArrowRight") {
    player.velocity.x = 5;
    offset = 1;
  }
  if (event.key === "ArrowLeft") {
    player.velocity.x = -5;
  }
  if (event.key === "ArrowUp") {
    player.velocity.y = -20;
  }
});

addEventListener("keyup", function (event) {
  if (event.key === "ArrowRight") {
    player.velocity.x = 0;
    offset = 0;
  }
  if (event.key === "ArrowLeft") {
    player.velocity.x = 0;
  }
  if (event.key === "ArrowUp") {
    player.velocity.y = 1;
  }
});
