const beginBtn = document.getElementById("beginBtn");
const intro = document.getElementById("intro");
const music = document.getElementById("bgMusic");

beginBtn.onclick = () => {
  intro.remove();
  startLevel(1);
};

function startLevel(level) {

  const solved = document.getElementById("solvedGrid");
  const unsolved = document.getElementById("unsolvedGrid");
  const referenceImg = document.getElementById("referenceImg");

  solved.innerHTML = "";
  unsolved.innerHTML = "";

  const grid = level * 2 + 1;
  const pieceSize = 40;

  solved.style.gridTemplateColumns = `repeat(${grid}, ${pieceSize}px)`;
  unsolved.style.gridTemplateColumns = `repeat(${Math.min(grid, 5)}, ${pieceSize}px)`;

  const imgSrc = `assets/images/img${level}.jpg`;
  referenceImg.src = imgSrc;

  music.src = `assets/music/m${level}.mp3`;
  music.volume = 0.4;
  music.play();

  let pieces = [];

  for (let y = 0; y < grid; y++) {
    for (let x = 0; x < grid; x++) {

      // Solved slot
      const slot = document.createElement("div");
      slot.className = "slot";
      slot.dataset.x = x;
      slot.dataset.y = y;
      solved.appendChild(slot);

      // Puzzle piece
      const piece = document.createElement("div");
      piece.className = "piece";
      piece.dataset.x = x;
      piece.dataset.y = y;
      piece.style.backgroundImage = `url(${imgSrc})`;
      piece.style.backgroundSize = `${grid * pieceSize}px ${grid * pieceSize}px`;
      piece.style.backgroundPosition = `-${x * pieceSize}px -${y * pieceSize}px`;

      pieces.push(piece);
    }
  }

  // Shuffle pieces
  pieces.sort(() => Math.random() - 0.5);
  pieces.forEach(p => unsolved.appendChild(p));

  enablePlacement();
}

function enablePlacement() {

  let selectedPiece = null;

  document.querySelectorAll(".piece").forEach(piece => {

    piece.addEventListener("touchstart", () => {
      selectedPiece = piece;
    });

    piece.addEventListener("touchend", () => {

      if (!selectedPiece) return;

      document.querySelectorAll(".slot").forEach(slot => {

        if (
          slot.dataset.x === selectedPiece.dataset.x &&
          slot.dataset.y === selectedPiece.dataset.y &&
          slot.children.length === 0
        ) {
          slot.appendChild(selectedPiece);
          selectedPiece = null;
        }

      });

    });

  });
}
