const gridEl = document.querySelector("#grid");
const checkButton = document.querySelector("#check");
const livesDisplay = document.querySelector("#lives");
const solvedArea = document.querySelector("#solved-area");
const restartButton = document.querySelector("#restart");

let selected = [];
let mistakes = 0;
let solvedGroups = 0;
let gameOver = false;

const groups = [
  {
    name: "TIERE MADAGASKARS",
    words: ["Lemur", "Fossa", "Aye-Aye", "Indri"],
    className: "yellow",
    solved: false
  },
  {
    name: "HISTORISCHE HERRSCHER",
    words: ["Vaohaka Ntaolo", "Diogo Dias", "Adrianampoinimerina", "Ranavalora"],
    className: "green",
    solved: false
  },
  {
    name: "WÖRTER AUS DEM FRANZÖSISCHEN",
    words: ["Bazar", "Camaron", "Gargote", "Kalalao"],
    className: "blue",
    solved: false
  },
  {
    name: "ETHNISCHE GRUPPEN",
    words: ["Merina", "Betsimisaraka", "Betsileo", "Tsimihety"],
    className: "purple",
    solved: false
  }
];

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function renderBoard() {
  const allWords = shuffle(groups.flatMap(group => group.words));

  gridEl.innerHTML = "";

  allWords.forEach((word) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = word;
    button.addEventListener("click", () => toggleSelection(button, word));
    gridEl.appendChild(button);
  });
}

function toggleSelection(button, word) {
  if (gameOver) return;

  const alreadySelected = button.classList.contains("selected");

  if (alreadySelected) {
    button.classList.remove("selected");
    selected = selected.filter((item) => item.button !== button);
    return;
  }

  if (selected.length >= 4) return;

  button.classList.add("selected");
  selected.push({ button, word });
}

function updateLivesDisplay() {
  const remaining = Math.max(4 - mistakes, 0);
  const dots = "● ".repeat(remaining);
  livesDisplay.textContent = remaining > 0
    ? `Fehlversuche übrig: ${dots}`
    : "Fehlversuche übrig: 0";
}

function addSolvedRow(group) {
  const row = document.createElement("div");
  row.className = `solution-row ${group.className}`;

  row.innerHTML = `
    <strong>${group.name}</strong>
    <span>${group.words.join(" · ")}</span>
  `;

  solvedArea.appendChild(row);
}

function revealAllRemainingGroups() {
  groups.forEach((group) => {
    if (!group.solved) {
      group.solved = true;
      addSolvedRow(group);
    }
  });
}

function resetSelectionVisuals() {
  selected.forEach(({ button }) => button.classList.remove("selected"));
  selected = [];
}

function finishGame(message) {
  gameOver = true;
  checkButton.disabled = true;
  livesDisplay.textContent = message;
  gridEl.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
  });
}

function checkSelection() {
  if (gameOver) return;

  if (selected.length !== 4) {
    alert("Wähle genau 4 Begriffe aus!");
    return;
  }

  const selectedWords = selected.map(({ word }) => word);

  const correctGroup = groups.find(
    (group) =>
      !group.solved &&
      group.words.length === selectedWords.length &&
      group.words.every((word) => selectedWords.includes(word))
  );

  if (correctGroup) {
    correctGroup.solved = true;
    solvedGroups++;

    selected.forEach(({ button }) => {
      button.remove();
    });

    addSolvedRow(correctGroup);
    selected = [];

    if (solvedGroups === groups.length) {
      finishGame("🎉 Alle Connections gefunden!");
    }
  } else {
    mistakes++;
    resetSelectionVisuals();
    updateLivesDisplay();

    if (mistakes >= 4) {
      revealAllRemainingGroups();
      gridEl.innerHTML = "";
      finishGame("❌ Keine Fehlversuche mehr");
    } else {
      alert("Leider falsch ❌");
    }
  }
}

function startNewGame() {
  groups.forEach((group) => {
    group.solved = false;
  });

  mistakes = 0;
  solvedGroups = 0;
  gameOver = false;
  selected = [];

  solvedArea.innerHTML = "";
  checkButton.disabled = false;
  renderBoard();
  updateLivesDisplay();
}

checkButton.addEventListener("click", checkSelection);
restartButton.addEventListener("click", startNewGame);

startNewGame();
