const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = {
  x: 180,
  y: 550,
  width: 40,
  height: 40
};

let bullets = [];
let enemies = [];
let score = 0;
let gameOver = false;

// Gerakan
function moveLeft() {
  if (!gameOver) player.x -= 30;
}
function moveRight() {
  if (!gameOver) player.x += 30;
}

// Tembak
function shoot() {
  if (!gameOver) {
    bullets.push({
      x: player.x + 15,
      y: player.y
    });
  }
}

// Spawn musuh
function spawnEnemy() {
  if (!gameOver) {
    enemies.push({
      x: Math.random() * 360,
      y: 0,
      size: 40
    });
  }
}
setInterval(spawnEnemy, 1000);

// Update game
function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Peluru
  ctx.fillStyle = "yellow";
  bullets.forEach((b, i) => {
    b.y -= 5;
    ctx.fillRect(b.x, b.y, 5, 10);

    if (b.y < 0) bullets.splice(i, 1);
  });

  // Musuh
  ctx.fillStyle = "red";
  enemies.forEach((e, ei) => {
    e.y += 3;
    ctx.fillRect(e.x, e.y, e.size, e.size);

    // kalah
    if (e.y > canvas.height) {
      gameOver = true;
      document.getElementById("respawnBtn").style.display = "block";
    }

    // tabrakan
    bullets.forEach((b, bi) => {
      if (
        b.x < e.x + e.size &&
        b.x + 5 > e.x &&
        b.y < e.y + e.size &&
        b.y + 10 > e.y
      ) {
        enemies.splice(ei, 1);
        bullets.splice(bi, 1);
        score++;
        document.getElementById("score").innerText = score;
      }
    });
  });

  requestAnimationFrame(update);
}

update();

// Respawn
function respawn() {
  player.x = 180;
  bullets = [];
  enemies = [];
  score = 0;
  gameOver = false;

  document.getElementById("score").innerText = score;
  document.getElementById("respawnBtn").style.display = "none";

  update();
}

// Keyboard
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") moveLeft();
  if (e.key === "ArrowRight") moveRight();
  if (e.key === " ") shoot();
});