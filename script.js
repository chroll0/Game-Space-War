const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.9;
if (window.innerWidth < 750) {
  canvas.width = 750;
}
const explodedSpaceships = document.querySelector(".explodedSpaceships");
const gameLevels = document.querySelector(".gameLevels");
const timer = document.querySelector(".timer");
const gameLives = document.querySelector(".gameLives");
const playPause = document.querySelector(".play-pause");

const spaceshipImage = new Image();
spaceshipImage.src = "Images/spaceship01.png";
const enemyBossSpaceshipImage = new Image();
enemyBossSpaceshipImage.src = "Images/enemyBossSpaceship.png";
const enemySpaceshipImage01 = new Image();
enemySpaceshipImage01.src = "Images/enemySpaceship01.png";
const enemySpaceshipImage02 = new Image();
enemySpaceshipImage02.src = "Images/enemySpaceship02.png";
const enemySpaceshipImage03 = new Image();
enemySpaceshipImage03.src = "Images/enemySpaceship03.png";
const enemySpaceshipImage04 = new Image();
enemySpaceshipImage04.src = "Images/enemySpaceship04.png";

let spaceship,
  enemy,
  enemyBoss,
  playing,
  bullets,
  enemyBullets,
  timerFunction,
  gameTime,
  playerLives,
  extraLives,
  levelOne,
  levelTwo,
  bossLevel;

initialization();
startGame();
timerFunction = setInterval(() => {
  const minutes = Math.floor(gameTime / 60);
  const seconds = gameTime % 60;
  timer.textContent = `⏳ ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  gameTime++;
}, 1000);

function startGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSpaceship();
  for (let i = 0; i < bullets.length; i++) {
    drawBullet(bullets[i]);
  }
  for (let i = 0; i < enemyBullets.length; i++) {
    drawEnemyBullet(enemyBullets[i]);
  }
  fireEnemyBullet();
  drawEnemySpaceship();
  document.addEventListener("keydown", moveSpaceship);
  document.addEventListener("click", shootBullet);
  checkCollisions();
  requestAnimationFrame(startGame);
}
function initialization() {
  gameTime = 0;
  playerLives = 5;
  bullets = [];
  enemyBullets = [];
  enemy = [
    {
      width: 90,
      height: 90,
      x: canvas.width / 2 - 45,
      y: 10,
      speed: 1,
      fireRate: 400,
      fireCountdown: 0,
      enemyLives: 2,
    },
    {
      width: 90,
      height: 90,
      x: canvas.width / 2 - 90 * 2,
      y: 10,
      speed: 1,
      fireRate: 400,
      fireCountdown: 0,
      enemyLives: 2,
    },
    {
      width: 90,
      height: 90,
      x: canvas.width / 2 - 90 * 3 - 45,
      y: 10,
      speed: 1,
      fireRate: 400,
      fireCountdown: 0,
      enemyLives: 2,
    },
    {
      width: 90,
      height: 90,
      x: canvas.width / 2 - 90 * 5,
      y: 10,
      speed: 1,
      fireRate: 400,
      fireCountdown: 0,
      enemyLives: 2,
    },
    {
      width: 90,
      height: 90,
      x: canvas.width / 2 + 90,
      y: 10,
      speed: 1,
      fireRate: 400,
      fireCountdown: 0,
      enemyLives: 2,
    },
    {
      width: 90,
      height: 90,
      x: canvas.width / 2 + 90 * 2 + 45,
      y: 10,
      speed: 1,
      fireRate: 400,
      fireCountdown: 0,
      enemyLives: 2,
    },
    {
      width: 90,
      height: 90,
      x: canvas.width / 2 + 90 * 4,
      y: 10,
      speed: 1,
      fireRate: 400,
      fireCountdown: 0,
      enemyLives: 2,
    },
  ];
  enemyBoss = [
    {
      width: 200,
      height: 200,
      x: Math.random() * (canvas.width - 200),
      y: 10,
      speed: 10,
      enemyLives: 100,
    },
  ];
  spaceship = {
    width: 90,
    height: 90,
    x: canvas.width / 2 - 45,
    y: canvas.height - 90,
    speed: 5,
  };
  gameLives.textContent = "❤️❤️❤️❤️❤️";
  timer.textContent = "⏳ 0:00";
  clearInterval(timerFunction);
}
function drawSpaceship() {
  ctx.beginPath();
  ctx.drawImage(
    spaceshipImage,
    spaceship.x,
    spaceship.y,
    spaceship.width,
    spaceship.height
  );
  ctx.closePath();
}
function drawBullet(bullet) {
  ctx.beginPath();
  ctx.arc(bullet.x, bullet.y, bullet.radius, 0, 2 * Math.PI);
  if (bullet.y > -10) {
    bullet.y -= bullet.speed;
  } else {
    // Remove bullet from the bullets array if it goes out of the canvas
    bullets.splice(bullets.indexOf(bullet), 1);
  }
  ctx.fillStyle = "grey";
  ctx.fill();
  ctx.closePath();
}
function shootBullet() {
  // Add a new player bullet to the bullets array
  bullets.push({
    x: spaceship.x + spaceship.width / 2,
    y: spaceship.y,
    speed: 5,
    radius: 5,
  });
}
function drawEnemySpaceship() {
  for (let i = 0; i < enemy.length; i++) {
    ctx.beginPath();
    ctx.drawImage(
      enemySpaceshipImage01,
      enemy[i].x,
      enemy[i].y,
      enemy[i].width,
      enemy[i].height
    );
    ctx.closePath();
    // Update enemy position and direction
    if (enemy[i].x + enemy[i].width > canvas.width - 45) {
      enemy[i].y += 1;
    } else if (enemy[i].x < 45) {
      enemy[i].y -= 1;
    }
    if (enemy[i].x + enemy[i].width > canvas.width) {
      enemy[i].speed = -enemy[i].speed;
    } else if (enemy[i].x < 0) {
      enemy[i].speed = -enemy[i].speed;
    }
    enemy[i].x += enemy[i].speed;
  }
}
function drawEnemyBullet(bullet) {
  ctx.beginPath();
  ctx.arc(bullet.x, bullet.y, bullet.radius, 0, 2 * Math.PI);
  if (bullet.y < canvas.height + 10) {
    bullet.y += bullet.speed;
  } else {
    enemyBullets.splice(enemyBullets.indexOf(bullet), 1);
  }
  ctx.fillStyle = "#3849cd";
  ctx.fill();
  ctx.closePath();
}
function fireEnemyBullet() {
  for (let i = 0; i < enemy.length; i++) {
    if (enemy[i].fireCountdown <= 0) {
      enemyBullets.push({
        x: enemy[i].x + enemy[i].width / 2,
        y: enemy[i].y + enemy[i].height,
        radius: 5,
        speed: 1,
      });
      enemy[i].fireCountdown = enemy[i].fireRate;
    } else {
      enemy[i].fireCountdown--;
    }
  }
}
function checkCollisions() {
  for (let i = 0; i < enemy.length; i++) {
    let enemies = enemy[i];
    //when player spaceship touches to enemy spaceships
    if (
      spaceship.x <= enemies.x + enemies.width &&
      spaceship.x + spaceship.width >= enemies.x &&
      spaceship.y <= enemies.y + enemies.height &&
      spaceship.y + spaceship.height >= enemies.y
    ) {
      damageAnimation();
      enemy.splice(enemy.indexOf(enemies), 1);
    }
    for (let i = 0; i < bullets.length; i++) {
      if (
        bullets[i].x <= enemies.x + enemies.width &&
        bullets[i].x >= enemies.x &&
        bullets[i].y <= enemies.y + enemies.height &&
        bullets[i].y >= enemies.y
      ) {
        bullets.splice(bullets.indexOf(bullets), 1);
        enemies.enemyLives--;
        console.log(enemies.enemyLives);
        if (enemies.enemyLives == 0) {
          enemy.splice(enemy.indexOf(enemies), 1);
        }
      }
    }
  }
  for (let i = 0; i < enemyBullets.length; i++) {
    if (
      spaceship.x <= enemyBullets[i].x &&
      spaceship.x + spaceship.width >= enemyBullets[i].x &&
      spaceship.y <= enemyBullets[i].y &&
      spaceship.y + spaceship.height >= enemyBullets[i].y
    ) {
      damageAnimation();
      enemyBullets.splice(enemyBullets.indexOf(enemyBullets[i]), 1);
    }
  }
}
function moveSpaceship(e) {
  switch (e.keyCode) {
    case 37: // Left arrow
      if (spaceship.x > 0) {
        spaceship.x -= spaceship.speed;
      }
      break;
    case 38: // Up arrow
      if (spaceship.y > 0) {
        spaceship.y -= spaceship.speed;
      }
      break;
    case 39: // Right arrow
      if (spaceship.x + spaceship.width < canvas.width) {
        spaceship.x += spaceship.speed;
      }
      break;
    case 40: // Down arrow
      if (spaceship.y + spaceship.height < canvas.height) {
        spaceship.y += spaceship.speed;
      }
      break;
  }
  switch (e.key) {
    case "a": // Left arrow
      if (spaceship.x > 0) {
        spaceship.x -= spaceship.speed;
      }
      break;
    case "w": // Up arrow
      if (spaceship.y > 0) {
        spaceship.y -= spaceship.speed;
      }
      break;
    case "d": // Right arrow
      if (spaceship.x + spaceship.width < canvas.width) {
        spaceship.x += spaceship.speed;
      }
      break;
    case "s": // Down arrow
      if (spaceship.y + spaceship.height < canvas.height) {
        spaceship.y += spaceship.speed;
      }
      break;
    case " ": //shot bullets
      shootBullet();
      break;
  }
}
function damageAnimation() {
  playerLives--;
  gameLives.textContent = "❤️❤️❤️❤️❤️";
  spaceshipImage.src = "";
  setTimeout(() => {
    spaceshipImage.src = "Images/spaceship01.png";
  }, 50);
  setTimeout(() => {
    spaceshipImage.src = "";
  }, 100);
  setTimeout(() => {
    spaceshipImage.src = "Images/spaceship01.png";
  }, 150);
}
