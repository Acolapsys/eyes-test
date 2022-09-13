import { generateTable } from "./generate.js";

const $table = document.querySelector(".table");
const $startButton = document.querySelector(".start-button");
const $clearButton = document.querySelector(".clear-button");

let intervalId = null;
let timeout = null;

generateTable($table);

const highLightCell = ($cell) => {
  $cell.style.background = "#fff";
};

const unHighLightCell = ($cell) => {
  $cell.style.background = "#222";
};
const clearTable = (node) => {
  for (let i = 0; i < node.childNodes.length; i++) {
    let child = node.childNodes[i];
    console.log("1", child);
    clearTable(child);
    if (child.tagName === "td") {
      unHighLightCell(child);
    }
  }
};

const startInterval = () => {
  return setInterval(() => {
    const x = Math.floor(Math.random() * 50);
    const y = Math.floor(Math.random() * 50);

    const $cell = $table.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    highLightCell($cell);
    timeout = setTimeout(() => {
      unHighLightCell($cell);
    }, 1000);
  }, 1500);
};
const stop = () => {
  $startButton.innerHTML = "Start";
  clearInterval(intervalId);
  intervalId = null;
};

const start = () => {
  $startButton.innerHTML = "Stop";
  intervalId = startInterval();
};

$startButton.onclick = () => {
  $startButton.blur();
  if (intervalId) {
    stop();
  } else {
    start();
  }
};

$clearButton.onclick = () => {
  generateTable($table);
};
window.addEventListener("keydown", () => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
});
