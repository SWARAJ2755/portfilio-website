/* ================= MODAL ================= */

const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");

function openProject(type) {
  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  if (type === "snake") loadSnakeGame();
  if (type === "weather") loadWeatherApp();
  if (type === "calculator") loadCalculator();
}

function closeModal() {
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
}

/* ================= SNAKE GAME (WORKING) ================= */

let snakeInterval;

function loadSnakeGame() {
  modalTitle.innerText = "Java Snake Game (JS Version)";
  modalBody.innerHTML = `
    <canvas id="snakeCanvas" width="400" height="400"
      style="background:#1e293b;border-radius:10px"></canvas>
    <p style="margin-top:1rem">Score: <span id="score">0</span></p>
    <button onclick="resetSnake()">Restart</button>
  `;
  initSnake();
}

function initSnake() {
  const canvas = document.getElementById("snakeCanvas");
  const ctx = canvas.getContext("2d");
  const box = 20;

  let snake = [{ x: 200, y: 200 }];
  let food = randomFood();
  let dir = "RIGHT";
  let score = 0;

  document.onkeydown = e => {
    if (e.key === "ArrowUp" && dir !== "DOWN") dir = "UP";
    if (e.key === "ArrowDown" && dir !== "UP") dir = "DOWN";
    if (e.key === "ArrowLeft" && dir !== "RIGHT") dir = "LEFT";
    if (e.key === "ArrowRight" && dir !== "LEFT") dir = "RIGHT";
  };

  function randomFood() {
    return {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box
    };
  }

  function draw() {
    ctx.clearRect(0, 0, 400, 400);

    snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? "#6366f1" : "#8b5cf6";
      ctx.fillRect(s.x, s.y, box, box);
    });

    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(food.x, food.y, box, box);

    let head = { ...snake[0] };
    if (dir === "UP") head.y -= box;
    if (dir === "DOWN") head.y += box;
    if (dir === "LEFT") head.x -= box;
    if (dir === "RIGHT") head.x += box;

    if (
      head.x < 0 || head.y < 0 ||
      head.x >= 400 || head.y >= 400 ||
      snake.some(s => s.x === head.x && s.y === head.y)
    ) {
      clearInterval(snakeInterval);
      alert("Game Over!");
      return;
    }

    if (head.x === food.x && head.y === food.y) {
      score++;
      document.getElementById("score").innerText = score;
      food = randomFood();
    } else {
      snake.pop();
    }

    snake.unshift(head);
  }

  snakeInterval = setInterval(draw, 120);

  window.resetSnake = () => {
    clearInterval(snakeInterval);
    initSnake();
  };
}

/* ================= WEATHER APP (REAL API) ================= */

function loadWeatherApp() {
  modalTitle.innerText = "Weather Web App";
  modalBody.innerHTML = `
    <input id="city" placeholder="Enter city">
    <button onclick="getWeather()">Search</button>
    <div id="weatherResult"></div>
  `;
}

window.getWeather = async function () {
  const city = document.getElementById("city").value;
  const result = document.getElementById("weatherResult");

  if (!city) {
    result.innerHTML = "Enter a city";
    return;
  }

  const API_KEY = "YOUR_API_KEY_HERE"; // 👈 OpenWeatherMap
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod !== 200) throw new Error();

    result.innerHTML = `
      <h2>${data.name}</h2>
      <h1>${data.main.temp}°C</h1>
      <p>${data.weather[0].description}</p>
    `;
  } catch {
    result.innerHTML = "City not found";
  }
};

/* ================= CALCULATOR (WORKING) ================= */

function loadCalculator() {
  modalTitle.innerText = "Scientific Calculator";
  modalBody.innerHTML = `
    <input id="calc" readonly>
    <div class="grid">
      ${["7","8","9","/","4","5","6","*","1","2","3","-","0",".","=","+"]
        .map(b => `<button onclick="calc('${b}')">${b}</button>`)
        .join("")}
      <button onclick="clearCalc()">C</button>
    </div>
  `;
}

window.calc = val => {
  const d = document.getElementById("calc");
  if (val === "=") {
    try { d.value = eval(d.value); }
    catch { d.value = "Error"; }
  } else d.value += val;
};

window.clearCalc = () => {
  document.getElementById("calc").value = "";
};

/* ================= DAY / NIGHT HOVER ================= */

document.querySelectorAll(".project-card").forEach(card => {
  card.addEventListener("mouseenter", () => {
    card.style.boxShadow = document.body.classList.contains("dark-mode")
      ? "0 0 25px rgba(99,102,241,0.6)"
      : "0 10px 25px rgba(0,0,0,0.2)";
  });
  card.addEventListener("mouseleave", () => {
    card.style.boxShadow = "none";
  });
});
