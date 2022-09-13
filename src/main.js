import { generateTable } from "./generate.js";

const $table = document.querySelector(".table");
const $startButton = document.querySelector(".start-button");
const $clearButton = document.querySelector(".clear-button");

const onColor = "#fff";
const offColor = "#222";

let intervalId = null;
let timeout = null;

generateTable($table);

const highLightCell = ($cell) => {
  $cell.style.background = onColor;
};

const unHighLightCell = ($cell) => {
  $cell.style.background = offColor;
};
const clearTable = (node) => {
  for (let i = 0; i < node.childNodes.length; i++) {
    let child = node.childNodes[i];
    clearTable(child);
    if (child.tagName === "td") {
      unHighLightCell(child);
    }
  }
};
const generateTestArray = () => {
  const arr = [];
  for (let i = 0; i < 50; i++) {
    for (let j = 0; j < 50; j++) {
      arr.push({ x: i, y: j });
    }
  }
  return arr;
};

const startInterval = () => {
  const testArr = generateTestArray();
  return setInterval(() => {
    const idx = Math.floor(Math.random() * testArr.length - 1);

    const $cell = $table.querySelector(
      `[data-x="${testArr[idx].x}"][data-y="${testArr[idx].y}"]`
    );
    highLightCell($cell);
    timeout = setTimeout(() => {
      unHighLightCell($cell);
    }, 500);
    testArr.splice(idx, 1);
    console.log(testArr.length);
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
