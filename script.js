const intro = document.getElementById("intro");
const beginBtn = document.getElementById("beginBtn");
const music = document.getElementById("bgMusic");

let unlockedLevel = Number(localStorage.getItem("level")) || 1;
let currentLevel = 1;
let selectedPiece = null;
let placedCount = 0;

const notes = {
  1: "This was easy… like smiling when I think of you.",
  2: "You’re doing great. I knew you would.",
  3: "Some things take patience.",
  4: "Every piece fits somewhere.",
  5: "Halfway there. I’m proud of you.",
  6: "You’re more capable than you think.",
  7: "Almost there. I’m right here.",
  8: "This took effort. I see it.",
  9: "One more step. Take your time.",
  10: "You finished. I meant this."
};

beginBtn.onclick = () => {
  intro.remove();
  renderLevels();
  startLevel(1);
};

function renderLevels() {
  const levels = document.getElementById("levels");
  levels.innerHTML = "";

  for (let i = 1; i <= 10; i++) {
    const btn = document.createElement("button");
    btn.textContent = `Level ${i}`;

    if (i > unlockedLevel) {
      btn.classList.add("locked");
      btn.disabled = true;
    } else {
      btn.onclick = () => startLevel(i);
    }

    levels.appendChild(btn);
  }
}

function startLevel(level) {
  currentLevel = level;
  placedCount = 0;
  selectedPiece = null;

  const solved = document.getElementById("solvedGrid");
  const unsolved = document.getElementById("unsolvedGrid");
  const refImg = document.getElementById("referenceImg");

  solved.innerHTML = "";
  unsolved.innerHTML = "";

  const grid = level * 2 + 1;

  // Auto scale piece size
  const maxWidth = Math.min(window.innerWidth * 0.6, 360);
  const pieceSize = Math.floor(maxWidth / grid);

  solved.style.gridTemplateColumns = `repeat(${grid}, ${pieceSize}px)`;
  unsolved.style.gridTemplateColumns = `repeat(${Math.min(grid, 5)}, ${pieceSize}px)`;

  const imgSrc = `assets/images/img${level}.jpg`;
  refImg.src = imgSrc;

  music.src = `assets/music/m${level}.mp3`;
  music.volume = 0.4;
  music.play();

  let pieces = [];

  for (let y = 0; y < grid; y++) {
    for (let x = 0; x < grid; x++) {
      const slot = document.createElement("div");
      slot.className = "slot";
      slot.style.width = pieceSize + "px";
      slot.style.height = pieceSize + "px";
      slot.dataset.x = x;
      slot.dataset.y = y;
      slot.onclick = () => tryPlace(slot);
      solved.appendChild(slot);

      const piece = document.createElement("div");
      piece.className = "piece";
      piece.style.width = pieceSize + "px";
      piece.style.height = pieceSize + "px";
      piece.dataset.x = x;
      piece.dataset.y = y;
      piece.style.backgroundImage = `url(${imgSrc})`;
      piece.style.backgroundSize = `${grid * pieceSize}px ${grid * pieceSize}px`;
      piece.style.backgroundPosition = `-${x * pieceSize}px -${y * pieceSize}px`;
      piece.onclick = () => selectPiece(piece);

      pieces.push(piece);
    }
  }

  pieces.sort(() => Math.random() - 0.5);
  pieces.forEach(p => unsolved.appendChild(p));
}

function selectPiece(piece) {
  document.querySelectorAll(".piece").forEach(p => p.classList.remove("selected"));
  selectedPiece = piece;
  piece.classList.add("selected");
}

function tryPlace(slot) {
  if (!selectedPiece) return;

  if (
    slot.dataset.x === selectedPiece.dataset.x &&
    slot.dataset.y === selectedPiece.dataset.y &&
    slot.children.length === 0
  ) {
    slot.appendChild(selectedPiece);
    slot.classList.add("glow");
    setTimeout(() => slot.classList.remove("glow"), 300);

    selectedPiece.classList.remove("selected");
    selectedPiece.onclick = null;
    selectedPiece = null;
    placedCount++;

    if (placedCount === document.querySelectorAll(".slot").length) {
      levelComplete();
    }
  } else {
    slot.classList.add("shake");
    setTimeout(() => slot.classList.remove("shake"), 300);
    document.getElementById("unsolvedGrid").appendChild(selectedPiece);
    selectedPiece.classList.remove("selected");
    selectedPiece = null;
  }
}

function levelComplete() {
  if (currentLevel === unlockedLevel && unlockedLevel < 10) {
    unlockedLevel++;
    localStorage.setItem("level", unlockedLevel);
  }

  renderLevels();
  showNote();
}

function showNote() {
  const overlay = document.createElement("div");
  overlay.className = "noteOverlay";
  overlay.innerHTML = `
    <div class="noteBox">
      <p>${notes[currentLevel]}</p>
      <button id="nextBtn">${currentLevel === 10 ? "Finish" : "Next Level"}</button>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById("nextBtn").onclick = () => {
    overlay.remove();
    if (currentLevel < 10) {
      startLevel(currentLevel + 1);
    } else {
      showFinalReward();
    }
  };
}

function showFinalReward() {
  document.body.innerHTML = `
    <div class="noteOverlay">
      <div class="noteBox">
        <h2>💖 For You 💖</h2>
        <p>🎬 Movie Date<br>🍽️ Lunch Paid<br>🌹 Flowers Included</p>
        <p>Redeem this with me anytime.</p>
      </div>
    </div>
  `;
}
