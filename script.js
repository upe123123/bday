const kittyCanvas = document.getElementById('kittyCanvas');
const ctx = kittyCanvas.getContext('2d');

function resizeCanvas() {
  kittyCanvas.width = window.innerWidth;
  kittyCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Kitty base image with eyes open
const kittyBaseImg = new Image();
kittyBaseImg.src = 'https://i.imgur.com/OvMZBs9.png'; // kitty open eyes

// Kitty closed eyes image for blinking
const kittyBlinkImg = new Image();
kittyBlinkImg.src = 'https://i.imgur.com/0x9Rdx0.png'; // kitty eyes closed version

// Kitty paw waving overlay (small transparent PNG)
const kittyPawImg = new Image();
kittyPawImg.src = 'https://i.imgur.com/73Fv0bN.png'; // paw waving overlay

// Utility random
function randomRange(min, max) { return Math.random() * (max - min) + min; }

class Kitty {
  constructor() {
    this.x = randomRange(0, kittyCanvas.width);
    this.y = kittyCanvas.height + randomRange(20, 100);
    this.baseSize = randomRange(30, 60);
    this.size = this.baseSize;
    this.speed = randomRange(0.5, 2);
    this.angle = randomRange(0, 2 * Math.PI);
    this.angularSpeed = randomRange(0.01, 0.03);
    this.offsetX = 0;

    // Animation states
    this.blinkTime = 0;
    this.blinkDuration = 200; // ms blink duration
    this.blinkInterval = randomRange(3000, 7000);
    this.isBlinking = false;

    // Jump animation
    this.jumpProgress = 0;
    this.jumpSpeed = randomRange(0.02, 0.04);

    // Paw waving toggle
    this.pawWaveCycle = randomRange(0, Math.PI * 2);
  }

  update(deltaTime) {
    this.y -= this.speed;
    this.angle += this.angularSpeed;
    this.offsetX = Math.sin(this.angle) * 10;
    this.x += this.offsetX * 0.05;

    if (this.y + this.size < 0) {
      this.y = kittyCanvas.height + randomRange(20, 100);
      this.x = randomRange(0, kittyCanvas.width);
      this.baseSize = randomRange(30, 60);
      this.size = this.baseSize;
      this.speed = randomRange(0.5, 2);
    }

    // Blinking logic
    this.blinkTime += deltaTime;
    if (!this.isBlinking && this.blinkTime > this.blinkInterval) {
      this.isBlinking = true;
      this.blinkTime = 0;
    }
    if (this.isBlinking && this.blinkTime > this.blinkDuration) {
      this.isBlinking = false;
      this.blinkTime = 0;
      this.blinkInterval = randomRange(3000, 7000);
    }

    // Jumping animation
    this.jumpProgress += this.jumpSpeed;
    if (this.jumpProgress > Math.PI * 2) this.jumpProgress -= Math.PI * 2;

    this.size = this.baseSize + Math.sin(this.jumpProgress) * (this.baseSize * 0.15);

    // Paw waving cycle update
    this.pawWaveCycle += 0.05;
    if (this.pawWaveCycle > Math.PI * 2) this.pawWaveCycle -= Math.PI * 2;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.sin(this.angle) * 0.1);

    // Draw kitty base
    if (this.isBlinking) {
      ctx.drawImage(kittyBlinkImg, -this.size / 2, -this.size / 2, this.size, this.size);
    } else {
      ctx.drawImage(kittyBaseImg, -this.size / 2, -this.size / 2, this.size, this.size);
    }

    // Draw paw waving if cycle in waving phase
    if (Math.sin(this.pawWaveCycle) > 0.7) {
      const pawSize = this.size * 0.3;
      ctx.drawImage(kittyPawImg, this.size * 0.1, -pawSize / 2, pawSize, pawSize);
    }

    ctx.restore();
  }
}

let lastTime = 0;
const kitties = [];
for (let i = 0; i < 30; i++) {
  kitties.push(new Kitty());
}

function animate(time=0) {
  let deltaTime = time - lastTime;
  lastTime = time;

  ctx.clearRect(0, 0, kittyCanvas.width, kittyCanvas.height);

  for (let kitty of kitties) {
    kitty.update(deltaTime);
    kitty.draw();
  }
  requestAnimationFrame(animate);
}

// Start animation once kitty base images loaded
Promise.all([
  new Promise(res => kittyBaseImg.onload = res),
  new Promise(res => kittyBlinkImg.onload = res),
  new Promise(res => kittyPawImg.onload = res)
]).then(() => {
  animate();
  playRandomMeow();
});

// Kitty meow sounds
const meowSounds = [
  'https://actions.google.com/sounds/v1/animals/cat_purr_close.ogg',
  'https://actions.google.com/sounds/v1/animals/cat_meow.ogg',
  'https://actions.google.com/sounds/v1/animals/cat_purring.ogg'
].map(src => {
  const audio = new Audio(src);
  audio.volume = 0.15;
  return audio;
});

function playRandomMeow() {
  const index = Math.floor(Math.random() * meowSounds.length);
  meowSounds[index].play();
  setTimeout(playRandomMeow, 3000 + Math.random() * 4000);
}

// Cake canvas and click logic
const cakeCanvas = document.getElementById('cake-canvas');
const cakeCtx = cakeCanvas.getContext('2d');

function drawCake() {
  cakeCtx.clearRect(0, 0, cakeCanvas.width, cakeCanvas.height);

  // Cake base
  cakeCtx.fillStyle = '#f8a5c2';
  cakeCtx.strokeStyle = '#d46a7e';
  cakeCtx.lineWidth = 5;
  cakeCtx.beginPath();
  cakeCtx.moveTo(50, 140);
  cakeCtx.lineTo(150, 140);
  cakeCtx.lineTo(140, 80);
  cakeCtx.lineTo(60, 80);
  cakeCtx.closePath();
  cakeCtx.fill();
  cakeCtx.stroke();

  // Frosting
  cakeCtx.fillStyle = '#fff0f6';
  cakeCtx.beginPath();
  cakeCtx.moveTo(60, 80);
  cakeCtx.bezierCurveTo(70, 30, 130, 30, 140, 80);
  cakeCtx.closePath();
  cakeCtx.fill();
  cakeCtx.stroke();

  // Candles
  for(let i=0; i<3; i++) {
    cakeCtx.fillStyle = '#fff';
    cakeCtx.fillRect(80 + i*20, 20, 5, 20);
    cakeCtx.strokeRect(80 + i*20, 20, 5, 20);

    // Flame
    cakeCtx.beginPath();
    cakeCtx.fillStyle = '#ffcb05';
    cakeCtx.moveTo(82 + i*20, 20);
    cakeCtx.quadraticCurveTo(85 + i*20, 10, 88 + i*20, 20);
    cakeCtx.closePath();
    cakeCtx.fill();
  }
}
drawCake();

// Confetti and wish place logic
const wishPlace = document.getElementById('wish-place');
const confettiCanvas = document.createElement('canvas');
confettiCanvas.style.position = 'absolute';
confettiCanvas.style.top = '0';
confettiCanvas.style.left = '0';
confettiCanvas.style.width = '100%';
confettiCanvas.style.height = '100%';
confettiCanvas.style.pointerEvents = 'none';
confettiCanvas.style.zIndex = '25';
wishPlace.appendChild(confettiCanvas);

const confettiCtx = confettiCanvas.getContext('2d');
confettiCanvas.width = wishPlace.clientWidth;
confettiCanvas.height = wishPlace.clientHeight;

window.addEventListener('resize', () => {
  confettiCanvas.width = wishPlace.clientWidth;
  confettiCanvas.height = wishPlace.clientHeight;
});

class Confetti {
  constructor() {
    this.x = Math.random() * confettiCanvas.width;
    this.y = Math.random() * confettiCanvas.height - confettiCanvas.height;
    this.size = (Math.random() * 8) + 4;
    this.speed = Math.random() * 3 + 2;
    this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
    this.tilt = Math.random() * 10 - 10;
    this.tiltSpeed = Math.random() * 0.1 + 0.05;
  }
  update() {
    this.y += this.speed;
    this.tilt += this.tiltSpeed;
    if (this.y > confettiCanvas.height) {
      this.y = -this.size;
      this.x = Math.random() * confettiCanvas.width;
    }
  }
  draw() {
    confettiCtx.beginPath();
    confettiCtx.lineWidth = this.size / 2;
    confettiCtx.strokeStyle = this.color;
    confettiCtx.moveTo(this.x + this.tilt, this.y);
    confettiCtx.lineTo(this.x, this.y + this.tilt + this.size / 2);
    confettiCtx.stroke();
  }
}

const confettiPieces = [];
function startConfetti() {
  confettiCanvas.width = wishPlace.clientWidth;
  confettiCanvas.height = wishPlace.clientHeight;
  confettiPieces.length = 0;
  for (let i = 0; i < 100; i++) {
    confettiPieces.push(new Confetti());
  }
  requestAnimationFrame(confettiLoop);
}

function confettiLoop() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  for (let c of confettiPieces) {
    c.update();
    c.draw();
  }
  requestAnimationFrame(confettiLoop);
}

// Dancing kitty animation in wish place
const dancingCanvas = document.getElementById('dancing-kitty');
const danceCtx = dancingCanvas.getContext('2d');
const dancingKittyImg = new Image();
dancingKittyImg.src = 'https://i.imgur.com/OvMZBs9.png';

let danceAngle = 0;
let danceDirection = 1;

function danceAnimate() {
  danceCtx.clearRect(0, 0, dancingCanvas.width, dancingCanvas.height);
  danceCtx.save();
  danceCtx.translate(dancingCanvas.width / 2, dancingCanvas.height / 2);
  danceCtx.rotate(Math.sin(danceAngle) * 0.4);
  danceCtx.drawImage(dancingKittyImg, -60, -60, 120, 120);
  danceCtx.restore();

  danceAngle += 0.05 * danceDirection;
  if (danceAngle > Math.PI / 4
|| danceAngle < -Math.PI / 4) {
danceDirection *= -1;
}
requestAnimationFrame(danceAnimate);
}

dancingKittyImg.onload = () => danceAnimate();

// Show wish place on cake click
cakeCanvas.addEventListener('click', () => {
document.getElementById('card').style.display = 'none';
wishPlace.style.display = 'block';
startConfetti();
});
