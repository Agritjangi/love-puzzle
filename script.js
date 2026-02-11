let unlocked = localStorage.getItem("level") || 1;
let time = 0;
let timer;
let completed = 0;
let currentLevel = 1;

const board = document.getElementById("puzzleBoard");
const timerText = document.getElementById("timer");
const scoreText = document.getElementById("score");
const music = document.getElementById("bgMusic");

const notes = {
  1: "This was easy… like smiling when I think of you.",
  2: "You’re doing great.",
  3: "Some things take patience.",
  4: "Every piece fits somewhere.",
  5: "Halfway there. I’m proud.",
  6: "You’re stronger than you know.",
  7: "Almost there.",
  8: "This took effort.",
  9: "One more step.",
  10: "You finished. I meant this."
};

document.getElementById("beginBtn").onclick = () => {
  document.getElementById("intro").remove();
  renderLevels();
};

function renderLevels() {
  const levels = document.getElementById("levels");
  levels.innerHTML = "";

  for (let i = 1; i <= 10; i++) {
    const b = document.createElement("button");
    b.textContent = `Level ${i}`;

    if (i > unlocked) {
      b.classList.add("locked");
      b.disabled = true;
    } else {
      b.onclick = () => startLevel(i);
    }

    levels.appendChild(b);
  }
}

function startLevel(level) {
  currentLevel = level;
  completed = 0;
  time = 0;
  board.innerHTML = "";

  clearInterval(timer);
  timer = setInterval(() => {
    time++;
    timerText.textContent = `⏱ ${time}s`;
  }, 1000);

  music.src = `assets/music/m${level}.mp3`;
  music.volume = 0.4;
  music.play();

  const grid = level * 2 + 1;
  board.style.gridTemplateColumns = `repeat(${grid}, 1fr)`;

  const img = `assets/images/img${level}.jpg`;
  let pieces = [];

  for (let y = 0; y < grid; y++) {
    for (let x = 0; x < grid; x++) {
      const p = document.createElement("div");
      p.className = "piece";
      p.dataset.x = x;
      p.dataset.y = y;
      p.style.backgroundImage = `url(${img})`;
      p.style.backgroundSize = `${grid * 80}px ${grid * 80}px`;
      p.style.backgroundPosition = `-${x * 80}px -${y * 80}px`;
      pieces.push(p);
    }
  }

  pieces.sort(() => Math.random() - 0.5);
  pieces.forEach(p => board.appendChild(p));
  enableTouch();
}

function enableTouch() {
  let selected = null;

  document.querySelectorAll(".piece").forEach(p => {
    p.addEventListener("touchstart", () => selected = p);

    p.addEventListener("touchmove", e => {
      const t = e.touches[0];
      p.style.position = "fixed";
      p.style.left = t.clientX - 40 + "px";
      p.style.top = t.clientY - 40 + "px";
    });

    p.addEventListener("touchend", () => {
      const target = document.elementFromPoint(
        parseInt(p.style.left),
        parseInt(p.style.top)
      );

      if (
        target &&
        target.classList.contains("piece") &&
        target.dataset.x === p.dataset.x &&
        target.dataset.y === p.dataset.y
      ) {
        target.replaceWith(p);
        p.style.position = "static";
        completed++;
        scoreText.textContent = `💗 ${completed * 100}`;

        if (completed === document.querySelectorAll(".piece").length) {
          clearInterval(timer);
          unlocked++;
          localStorage.setItem("level", unlocked);
          showNote();
          renderLevels();
        }
      }
    });
  });
}

function showNote() {
  const n = document.createElement("div");
  n.className = "note";
  n.innerHTML = `<div class="noteBox">${notes[currentLevel]}<br><br><button>Continue</button></div>`;
  document.body.appendChild(n);

  n.querySelector("button").onclick = () => {
    n.remove();
    if (currentLevel === 10) showReward();
  };
}

function showReward() {
  document.body.innerHTML = `
    <div style="text-align:center;padding:30px;">
      <h1>💖 For You 💖</h1>
      <div style="background:white;padding:20px;border-radius:20px;">
        🎬 Movie Date<br>
        🍽️ Lunch Paid<br>
        🌹 Flowers Included
      </div>
      <p>Redeem with me anytime.</p>
    </div>
  `;
}

setInterval(() => {
  const h = document.createElement("div");
  h.className = "heart";
  h.style.left = Math.random() * 100 + "vw";
  document.body.appendChild(h);
  setTimeout(() => h.remove(), 6000);
}, 600);
