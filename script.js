const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.9;
if (window.innerWidth < 1000) {
  canvas.width = 1000;
}
const explodedSpaceships = document.querySelector(".explodedSpaceships");
const playerRank = document.querySelector(".playerRank");
const rankOption = document.querySelector(".rank-option");
const timer = document.querySelector(".timer");
const gameLives = document.querySelector(".gameLives");
const playPause = document.querySelector(".play-pause");
const startBtn = document.querySelector(".startBtn");
const menuBtn = document.querySelector(".menuBtn");
const overlay = document.querySelector(".overlay");
const gameStartMessage = document.querySelector(".gameStartMessage");
const gameOverMessage = document.querySelector(".gameOverMessage");

const spaceshipImage = new Image();
spaceshipImage.src = "Images/spaceship01.png";
const enemyBossSpaceshipImage = new Image();
enemyBossSpaceshipImage.src = "Images/enemyBossSpaceship.png";
const enemySpaceshipImage = new Image();
enemySpaceshipImage.src = "Images/enemySpaceship01.png";

let spaceship,
  enemy,
  enemyBoss,
  playing,
  bullets,
  destroyedSpaceships,
  enemyBullets,
  timerFunction,
  gameTime,
  playerLives,
  gameLevel,
  enemyBossBullets;
playing = false;

playerRank.addEventListener("mouseover", function () {
  rankOption.classList.remove("hidden");
});
playerRank.addEventListener("mouseout", function () {
  rankOption.classList.add("hidden");
});
startBtn.addEventListener("click", function () {
  initialization();
  timerFunction = setInterval(() => {
    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;
    timer.textContent = `⏳ ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    gameTime++;
  }, 1000);
  overlay.classList.add("hidden");
  gameStartMessage.classList.add("hidden");
  playing = true;
  playPause.textContent = "pause";
  startGame();
});
playPause.addEventListener("click", function () {
  if (!playing) {
    playPause.textContent = "pause";
    playing = true;
    startGame();
    timerFunction = setInterval(() => {
      const minutes = Math.floor(gameTime / 60);
      const seconds = gameTime % 60;
      timer.textContent = `⏳ ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
      gameTime++;
    }, 1000);
  } else if (playing) {
    playPause.textContent = "play";
    playing = false;
    clearInterval(timerFunction);
  }
});
function startGame() {
  if (playing) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSpaceship();
    for (let i = 0; i < bullets.length; i++) {
      drawBullet(bullets[i]);
    }
    for (let i = 0; i < enemyBullets.length; i++) {
      drawEnemyBullet(enemyBullets[i]);
    }
    if (enemy.length <= 0 && gameLevel < 4) {
      gameLevel++;
      console.log("Game Level:" + gameLevel);
      refreshEnemy();
    }
    if (gameLevel == 4) {
      drawEnemyBoss();
      for (let i = 0; i < enemyBossBullets.length; i++) {
        drawEnemyBossBullet(enemyBossBullets[i]);
      }
      fireEnemyBossBullet();
    }
    drawEnemySpaceship();
    fireEnemyBullet();
    document.addEventListener("keydown", moveSpaceship);
    canvas.addEventListener("click", shootBullet);
    checkCollisions();
    requestAnimationFrame(startGame);
  }
}
function initialization() {
  gameTime = 0;
  playerLives = 5;
  destroyedSpaceships = 0;
  gameLevel = 0;
  bullets = [];
  enemyBullets = [];
  enemyBossBullets = [];
  enemy = [
    {
      width: 90,
      height: 90,
      x: canvas.width / 2 - 45,
      y: -90,
      speed: 1,
      fireRate: 400,
      fireCountdown: 300,
      enemyLives: 2,
    },
    {
      width: 90,
      height: 90,
      x: canvas.width / 2 - 90 * 2,
      y: -90,
      speed: 1,
      fireRate: 400,
      fireCountdown: 250,
      enemyLives: 2,
    },
    {
      width: 90,
      height: 90,
      x: canvas.width / 2 - 90 * 3 - 45,
      y: -90,
      speed: 1,
      fireRate: 400,
      fireCountdown: 200,
      enemyLives: 2,
    },
    {
      width: 90,
      height: 90,
      x: canvas.width / 2 - 90 * 5,
      y: -90,
      speed: 1,
      fireRate: 400,
      fireCountdown: 150,
      enemyLives: 2,
    },
    {
      width: 90,
      height: 90,
      x: canvas.width / 2 + 90,
      y: -90,
      speed: 1,
      fireRate: 400,
      fireCountdown: 100,
      enemyLives: 2,
    },
    {
      width: 90,
      height: 90,
      x: canvas.width / 2 + 90 * 2 + 45,
      y: -90,
      speed: 1,
      fireRate: 400,
      fireCountdown: 50,
      enemyLives: 2,
    },
    {
      width: 90,
      height: 90,
      x: canvas.width / 2 + 90 * 4,
      y: -90,
      speed: 1,
      fireRate: 400,
      fireCountdown: 0,
      enemyLives: 2,
    },
  ];
  enemyBoss = [
    {
      width: 220,
      height: 220,
      x: canvas.width / 2 - 110,
      y: 80,
      speed: 3,
      enemyLives: 100,
      fireRate: 80,
      fireCountdown: 80,
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
  explodedSpaceships.textContent = "🚀: " + destroyedSpaceships;
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
  ctx.fillStyle = "grey";
  ctx.fill();
  if (bullet.y > 1) {
    bullet.y -= bullet.speed;
  } else {
    // Remove bullet from the bullets array if it goes out of the canvas
    bullets.splice(bullets.indexOf(bullet), 1);
  }
  ctx.closePath();
}
function shootBullet() {
  if (playing) {
    // Add a new player bullet to the bullets array
    bullets.push({
      x: spaceship.x + spaceship.width / 2,
      y: spaceship.y,
      speed: 5,
      radius: 5,
    });
  }
}
function drawEnemySpaceship() {
  for (let i = 0; i < enemy.length; i++) {
    ctx.beginPath();
    ctx.drawImage(
      enemySpaceshipImage,
      enemy[i].x,
      enemy[i].y,
      enemy[i].width,
      enemy[i].height
    );
    ctx.closePath();
    // Update enemy position and direction
    if (enemy[i].y < 25) {
      enemy[i].y += 1;
    } else {
      if (enemy[i].x + enemy[i].width > canvas.width) {
        enemy[i].speed = -enemy[i].speed;
      } else if (enemy[i].x < 0) {
        enemy[i].speed = -enemy[i].speed;
      }
      if (enemy[i].x + enemy[i].width > canvas.width - 45) {
        enemy[i].y += 1;
      } else if (enemy[i].x < 45) {
        enemy[i].y += 1;
      }
      enemy[i].x += enemy[i].speed;
    }
  }
}
function drawEnemyBoss() {
  ctx.beginPath();
  ctx.drawImage(
    enemyBossSpaceshipImage,
    enemyBoss[0].x,
    enemyBoss[0].y,
    enemyBoss[0].width,
    enemyBoss[0].height
  );
  ctx.closePath();
  if (enemyBoss[0].x + enemyBoss[0].width > canvas.width - 30) {
    enemyBoss[0].speed = -3;
  } else if (enemyBoss[0].x < 30) {
    enemyBoss[0].speed = 3;
  }
  if (enemyBoss[0].x + enemyBoss[0].width > canvas.width - 300) {
    enemyBoss[0].y += enemyBoss[0].speed;
  } else if (enemyBoss[0].x < 300) {
    enemyBoss[0].y -= enemyBoss[0].speed;
  }
  enemyBoss[0].x += enemyBoss[0].speed;
}
function drawEnemyBullet(bullet) {
  ctx.beginPath();
  ctx.arc(bullet.x, bullet.y, bullet.radius, 0, 2 * Math.PI);
  if (bullet.y < canvas.height + 1) {
    bullet.y += bullet.speed;
  } else {
    enemyBullets.splice(enemyBullets.indexOf(bullet), 1);
  }
  if (gameLevel == 0) {
    ctx.fillStyle = "#6988ff";
  } else if (gameLevel == 1) {
    ctx.fillStyle = "#062e6a";
  } else if (gameLevel == 2) {
    ctx.fillStyle = "#0a0909";
  } else if (gameLevel == 3) {
    ctx.fillStyle = "#d29c21";
  }
  ctx.fill();
  ctx.closePath();
}
function fireEnemyBullet() {
  for (let i = 0; i < enemy.length; i++) {
    if (enemy[i].fireCountdown <= 0 && enemy[i].y >= 0) {
      enemyBullets.push({
        x: enemy[i].x + enemy[i].width / 2,
        y: enemy[i].y + enemy[i].height,
        radius: 5,
        speed: 1,
      });
      enemy[i].fireCountdown = enemy[i].fireRate;
    } else if (enemy[i].y >= 0) {
      enemy[i].fireCountdown--;
    }
  }
}
function drawEnemyBossBullet(enemyBossBullet) {
  ctx.beginPath();
  ctx.arc(
    enemyBossBullet.x,
    enemyBossBullet.y,
    enemyBossBullet.radius,
    0,
    2 * Math.PI
  );
  if (enemyBossBullet.y < canvas.height + 1) {
    enemyBossBullet.y += enemyBossBullet.speed;
  } else {
    enemyBossBullets.splice(enemyBossBullets.indexOf(enemyBossBullet), 1);
  }
  ctx.fillStyle = "#b11f01";
  ctx.fill();
  ctx.closePath();
}
function fireEnemyBossBullet() {
  if (enemyBoss[0].fireCountdown <= 0) {
    enemyBossBullets.push({
      x: enemyBoss[0].x + enemyBoss[0].width / 2,
      y: enemyBoss[0].y + enemyBoss[0].height,
      radius: 7,
      speed: 2.5,
    });
    enemyBossBullets.push({
      x: enemyBoss[0].x + enemyBoss[0].width / 2 + 30,
      y: enemyBoss[0].y + enemyBoss[0].height - 90,
      radius: 7,
      speed: 3,
    });
    enemyBossBullets.push({
      x: enemyBoss[0].x + enemyBoss[0].width / 2 - 30,
      y: enemyBoss[0].y + enemyBoss[0].height - 90,
      radius: 7,
      speed: 3,
    });
    enemyBossBullets.push({
      x: enemyBoss[0].x + enemyBoss[0].width / 2 + 80,
      y: enemyBoss[0].y + enemyBoss[0].height - 50,
      radius: 7,
      speed: 2,
    });
    enemyBossBullets.push({
      x: enemyBoss[0].x + enemyBoss[0].width / 2 - 80,
      y: enemyBoss[0].y + enemyBoss[0].height - 50,
      radius: 7,
      speed: 2,
    });
    enemyBoss[0].fireCountdown = enemyBoss[0].fireRate;
  } else if (enemyBoss[0].y >= 0) {
    enemyBoss[0].fireCountdown--;
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
        enemies.y >= 5 &&
        bullets[i].x <= enemies.x + enemies.width &&
        bullets[i].x >= enemies.x &&
        bullets[i].y <= enemies.y + enemies.height &&
        bullets[i].y >= enemies.y
      ) {
        bullets.splice(bullets.indexOf(bullets[i]), 1);
        enemies.enemyLives--;
        if (enemies.enemyLives == 0) {
          enemy.splice(enemy.indexOf(enemies), 1);
          destroyedSpaceships++;
          explodedSpaceships.textContent = "🚀: " + destroyedSpaceships;
          if (destroyedSpaceships >= 21) {
            playerRank.src = "Images/rank-two.png";
          } else if (destroyedSpaceships >= 35) {
            playerRank.src = "Images/rank-three.png";
          }
        } else if (destroyedSpaceships >= 56) {
          playerRank.src = "Images/rank-four.png";
        }
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
//check enemy Boss collisions
if (gameLevel == 4) {
  for (let i = 0; i < enemyBossBullets.length; i++) {
    if (
      spaceship.x <= enemyBossBullets[i].x &&
      spaceship.x + spaceship.width >= enemyBossBullets[i].x &&
      spaceship.y <= enemyBossBullets[i].y &&
      spaceship.y + spaceship.height >= enemyBossBullets[i].y
    ) {
      damageAnimation();
      enemyBossBullets.splice(enemyBossBullets.indexOf(enemyBossBullets[i]), 1);
    }
  }
  if (
    spaceship.x <= enemyBoss[0].x + enemyBoss[0].width &&
    spaceship.x + spaceship.width >= enemyBoss[0].x &&
    spaceship.y <= enemyBoss[0].y + enemyBoss[0].height &&
    spaceship.y + spaceship.height >= enemyBoss[0].y
  ) {
    damageAnimation();
  }
  for (let i = 0; i < bullets.length; i++) {
    if (
      bullets[i].x <= enemyBoss[0].x + enemyBoss[0].width &&
      bullets[i].x >= enemyBoss[0].x &&
      bullets[i].y <= enemyBoss[0].y + enemyBoss[0].height &&
      bullets[i].y >= enemyBoss[0].y
    ) {
      bullets.splice(bullets.indexOf(bullets[i]), 1);
      enemyBoss[0].enemyLives--;
      if (enemyBoss[0].enemyLives == 0) {
        enemyBoss.splice(enemyBoss.indexOf(enemyBoss[0]), 1);
      }
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
  if (playerLives == 4) {
    gameLives.textContent = "🤍❤️❤️❤️❤️";
  } else if (playerLives == 3) {
    gameLives.textContent = "🤍🤍❤️❤️❤️";
  } else if (playerLives == 2) {
    gameLives.textContent = "🤍🤍🤍❤️❤️";
  } else if (playerLives == 1) {
    gameLives.textContent = "🤍🤍🤍🤍❤️";
  } else if (playerLives == 0) {
    gameLives.textContent = "🤍🤍🤍🤍🤍";
    gameOver();
  }
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
function gameOver() {
  playing = false;
  overlay.classList.remove("hidden");
  gameOverMessage.classList.remove("hidden");
  playPause.textContent = "play";
  menuBtn.addEventListener("click", function () {
    gameOverMessage.classList.add("hidden");
    gameStartMessage.classList.remove("hidden");
  });
}
function refreshEnemy() {
  if (gameLevel == 1) {
    enemy = [
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 - 45,
        y: -90,
        speed: 1.5,
        fireRate: 400,
        fireCountdown: 300,
        enemyLives: 5,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 - 90 * 2,
        y: -90,
        speed: 1.5,
        fireRate: 400,
        fireCountdown: 250,
        enemyLives: 5,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 - 90 * 3 - 45,
        y: -90,
        speed: 1.5,
        fireRate: 400,
        fireCountdown: 200,
        enemyLives: 5,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 - 90 * 5,
        y: -90,
        speed: 1.5,
        fireRate: 400,
        fireCountdown: 150,
        enemyLives: 5,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 + 90,
        y: -90,
        speed: 1.5,
        fireRate: 400,
        fireCountdown: 100,
        enemyLives: 5,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 + 90 * 2 + 45,
        y: -90,
        speed: 1.5,
        fireRate: 400,
        fireCountdown: 50,
        enemyLives: 5,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 + 90 * 4,
        y: -90,
        speed: 1.5,
        fireRate: 400,
        fireCountdown: 0,
        enemyLives: 5,
      },
      //another enemy line
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 - 45,
        y: -1035,
        speed: 1.5,
        fireRate: 400,
        fireCountdown: 300,
        enemyLives: 5,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 - 90 * 2,
        y: -1035,
        speed: 1.5,
        fireRate: 400,
        fireCountdown: 250,
        enemyLives: 5,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 - 90 * 3 - 45,
        y: -1035,
        speed: 1.5,
        fireRate: 400,
        fireCountdown: 200,
        enemyLives: 5,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 - 90 * 5,
        y: -1035,
        speed: 1.5,
        fireRate: 400,
        fireCountdown: 150,
        enemyLives: 5,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 + 90,
        y: -1035,
        speed: 1.5,
        fireRate: 400,
        fireCountdown: 100,
        enemyLives: 5,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 + 90 * 2 + 45,
        y: -1035,
        speed: 1.5,
        fireRate: 400,
        fireCountdown: 50,
        enemyLives: 5,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 + 90 * 4,
        y: -1035,
        speed: 1.5,
        fireRate: 400,
        fireCountdown: 0,
        enemyLives: 5,
      },
    ];
    enemySpaceshipImage.src = "Images/enemySpaceship02.png";
  }
  if (gameLevel == 2) {
    enemy = [
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 - 45,
        y: -90,
        speed: 2,
        fireRate: 400,
        fireCountdown: 300,
        enemyLives: 10,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 - 90 * 2,
        y: -90,
        speed: 2,
        fireRate: 400,
        fireCountdown: 250,
        enemyLives: 10,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 - 90 * 3 - 45,
        y: -90,
        speed: 2,
        fireRate: 400,
        fireCountdown: 200,
        enemyLives: 10,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 - 90 * 5,
        y: -90,
        speed: 2,
        fireRate: 400,
        fireCountdown: 150,
        enemyLives: 10,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 + 90,
        y: -90,
        speed: 2,
        fireRate: 400,
        fireCountdown: 100,
        enemyLives: 10,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 + 90 * 2 + 45,
        y: -90,
        speed: 2,
        fireRate: 400,
        fireCountdown: 50,
        enemyLives: 10,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 + 90 * 4,
        y: -90,
        speed: 2,
        fireRate: 400,
        fireCountdown: 0,
        enemyLives: 10,
      },
      //another enemy line
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 - 45,
        y: -1035,
        speed: 2,
        fireRate: 400,
        fireCountdown: 300,
        enemyLives: 10,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 - 90 * 2,
        y: -1035,
        speed: 2,
        fireRate: 400,
        fireCountdown: 250,
        enemyLives: 10,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 - 90 * 3 - 45,
        y: -1035,
        speed: 2,
        fireRate: 400,
        fireCountdown: 200,
        enemyLives: 10,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 - 90 * 5,
        y: -1035,
        speed: 2,
        fireRate: 400,
        fireCountdown: 150,
        enemyLives: 10,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 + 90,
        y: -1035,
        speed: 2,
        fireRate: 400,
        fireCountdown: 100,
        enemyLives: 10,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 + 90 * 2 + 45,
        y: -1035,
        speed: 2,
        fireRate: 400,
        fireCountdown: 50,
        enemyLives: 10,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 + 90 * 4,
        y: -1035,
        speed: 2,
        fireRate: 400,
        fireCountdown: 0,
        enemyLives: 10,
      },
    ];
    enemySpaceshipImage.src = "Images/enemySpaceship03.png";
  }
  if (gameLevel == 3) {
    enemy = [
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 - 45,
        y: -90,
        speed: 3,
        fireRate: 400,
        fireCountdown: 300,
        enemyLives: 15,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 - 90 * 2,
        y: -90,
        speed: 3,
        fireRate: 400,
        fireCountdown: 250,
        enemyLives: 15,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 - 90 * 3 - 45,
        y: -90,
        speed: 3,
        fireRate: 400,
        fireCountdown: 200,
        enemyLives: 15,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 - 90 * 5,
        y: -90,
        speed: 3,
        fireRate: 400,
        fireCountdown: 150,
        enemyLives: 15,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 + 90,
        y: -90,
        speed: 3,
        fireRate: 400,
        fireCountdown: 100,
        enemyLives: 15,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 + 90 * 2 + 45,
        y: -90,
        speed: 3,
        fireRate: 400,
        fireCountdown: 50,
        enemyLives: 15,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 + 90 * 4,
        y: -90,
        speed: 3,
        fireRate: 400,
        fireCountdown: 0,
        enemyLives: 15,
      },
      //another enemy line
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 - 45,
        y: -1035,
        speed: 3,
        fireRate: 400,
        fireCountdown: 300,
        enemyLives: 15,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 - 90 * 2,
        y: -1035,
        speed: 3,
        fireRate: 400,
        fireCountdown: 250,
        enemyLives: 15,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 - 90 * 3 - 45,
        y: -1035,
        speed: 3,
        fireRate: 400,
        fireCountdown: 200,
        enemyLives: 15,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 - 90 * 5,
        y: -1035,
        speed: 3,
        fireRate: 400,
        fireCountdown: 150,
        enemyLives: 15,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 + 90,
        y: -1035,
        speed: 3,
        fireRate: 400,
        fireCountdown: 100,
        enemyLives: 15,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 + 90 * 2 + 45,
        y: -1035,
        speed: 3,
        fireRate: 400,
        fireCountdown: 50,
        enemyLives: 15,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 + 90 * 4,
        y: -1035,
        speed: 3,
        fireRate: 400,
        fireCountdown: 0,
        enemyLives: 15,
      },
      //another enemy line
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 - 45,
        y: -1035 * 2,
        speed: 3,
        fireRate: 400,
        fireCountdown: 300,
        enemyLives: 15,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 - 90 * 2,
        y: -1035 * 2,
        speed: 3,
        fireRate: 400,
        fireCountdown: 250,
        enemyLives: 15,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 - 90 * 3 - 45,
        y: -1035 * 2,
        speed: 3,
        fireRate: 400,
        fireCountdown: 200,
        enemyLives: 15,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 - 90 * 5,
        y: -1035 * 2,
        speed: 3,
        fireRate: 400,
        fireCountdown: 150,
        enemyLives: 15,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 + 90,
        y: -1035 * 2,
        speed: 3,
        fireRate: 400,
        fireCountdown: 100,
        enemyLives: 15,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 + 90 * 2 + 45,
        y: -1035 * 2,
        speed: 3,
        fireRate: 400,
        fireCountdown: 50,
        enemyLives: 15,
      },
      {
        width: 90,
        height: 90,
        x: canvas.width / 2 + 90 * 4,
        y: -1035 * 2,
        speed: 3,
        fireRate: 400,
        fireCountdown: 0,
        enemyLives: 15,
      },
    ];
    enemySpaceshipImage.src = "Images/enemySpaceship04.png";
  }
}
