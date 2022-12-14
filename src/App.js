const colors = Object.freeze({
  ON: "#fff",
  OFF: "#222"
});

const buttonTitle = Object.freeze({
  START: "Старт",
  PAUSE: "Пауза",
  CLEAR: "Новое поле"
});

export default class App {
  constructor({
    cols = 50,
    rows = 50,
    highlightTime = 500,
    pauseTime = 1000
  } = {}) {
    this.colsCount = cols;
    this.rowsCount = rows;
    this.highlightTime = highlightTime;
    this.pauseTime = pauseTime;
    this.$table = document.querySelector(".table");
    this.$startButton = document.querySelector(".start-button");
    this.$clearButton = document.querySelector(".clear-button");
    this.$counter = document.querySelector(".counter");
    this.$colsCount = document.querySelector("#cols");
    this.$rowsCount = document.querySelector("#rows");
    this.$highlightTime = document.querySelector("#highlightTime");
    this.$pauseTime = document.querySelector("#pauseTime");
    this.$saveButton = document.querySelector(".save-button");
    this.$resultButton = document.querySelector(".result-button");

    this.testArr = [];
    this.resultArr = [];
    this.intervalId = null;
    this.timeoutId = null;
    this.$cell = null;
    this.cellSaved = false;
    this.init();
  }

  init() {
    this.setElTitle(this.$startButton, buttonTitle.START);
    this.setElTitle(this.$clearButton, buttonTitle.CLEAR);

    this.setElValue(this.$colsCount, this.colsCount);
    this.setElValue(this.$rowsCount, this.rowsCount);
    this.setElValue(this.$highlightTime, this.highlightTime);
    this.setElValue(this.$pauseTime, this.pauseTime);
    this.initListeners();
  }

  get stepTime() {
    return +this.pauseTime + +this.highlightTime;
  }

  get leftCount() {
    return this.testArr?.length;
  }

  get isStarted() {
    return !!this.intervalId;
  }

  setElTitle($el, title) {
    $el.innerHTML = title;
  }

  setElValue($el, value) {
    $el.value = value;
  }

  highLightCell($cell) {
    if ($cell) {
      $cell.style.background = colors.ON;
    }
  }

  unHighLightCell($cell) {
    if ($cell) {
      $cell.style.background = colors.OFF;
    }
  }
  clearActiveCell() {
    this.$cell = null;
    this.cellSaved = false;
  }

  generateTable(withResult = false) {
    this.testArr = this.generateTestArray();
    this.setElTitle(this.$counter, this.leftCount);
    this.$table.innerHTML = "";

    const makeCell = () => {
      const $el = document.createElement("td");
      $el.classList.add("cell");
      return $el;
    };
    const cellsArray = Array.from(Array(this.rowsCount), () =>
      Array.from(Array(this.colsCount), () => makeCell())
    );

    cellsArray.forEach((row, rowIndex) => {
      const $row = document.createElement("tr");
      row.forEach(($cell, cellIndex) => {
        $row.append($cell);
        $cell.setAttribute("data-x", cellIndex);
        $cell.setAttribute("data-y", rowIndex);
        if (withResult) {
          const isHighlighted = this.resultArr.findIndex(
            (el) => +el.x === +cellIndex && +el.y === +rowIndex
          );

          if (isHighlighted !== -1) {
            this.highLightCell($cell);
          }
        }
      });
      this.$table.append($row);
    });

    const $cross = this.createCross();
    this.$table.append($cross);
  }

  createCross() {
    const iconSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    const iconPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );

    iconSvg.setAttribute("fill", "none");
    iconSvg.setAttribute("viewBox", "0 0 24 24");
    iconSvg.setAttribute("stroke", "currentColor");
    iconSvg.setAttribute("stroke-width", "1.5");
    iconSvg.classList.add("cross");

    iconPath.setAttribute("d", "M12 6v12m6-6H6");
    iconPath.setAttribute("stroke-linecap", "round");
    iconPath.setAttribute("stroke-linejoin", "round");
    iconPath.setAttribute("stroke-width", "2");

    iconSvg.appendChild(iconPath);

    return iconSvg;
  }

  generateTestArray() {
    const arr = [];
    for (let i = 0; i < this.rowsCount; i++) {
      for (let j = 0; j < this.colsCount; j++) {
        arr.push({ x: i, y: j });
      }
    }
    return arr;
  }

  startInterval() {
    return setInterval(() => {
      if (this.testArr.length) {
        const idx = Math.floor(Math.random() * (this.testArr.length - 1));

        this.$cell = this.$table.querySelector(
          `[data-x="${this.testArr[idx].x}"][data-y="${this.testArr[idx].y}"]`
        );
        this.highLightCell(this.$cell);
        this.timeoutId = setTimeout(() => {
          this.unHighLightCell(this.$cell);
          this.clearActiveCell();
        }, this.highlightTime);
        this.testArr.splice(idx, 1);
        this.setElTitle(this.$counter, this.leftCount);
      } else {
        this.stop();
      }
    }, this.stepTime);
  }
  stop() {
    this.setElTitle(this.$startButton, buttonTitle.START);
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  start() {
    this.setElTitle(this.$startButton, buttonTitle.PAUSE);
    this.intervalId = this.startInterval();
  }

  clearAll() {
    this.stop();
    this.clearActiveCell();
    clearTimeout(this.timeoutId);
    this.timeoutId = null;
  }

  unFocusButtons() {
    this.$startButton.blur();
    this.$clearButton.blur();
    this.$saveButton.blur();
    this.$resultButton.blur();
  }

  startButtonHandler() {
    this.unFocusButtons();
    if (this.isStarted) {
      this.stop();
    } else {
      this.start();
    }
  }

  initListeners() {
    this.$startButton.onclick = this.startButtonHandler.bind(this);
    this.$clearButton.onclick = () => {
      this.resultArr = [];
      this.generateTable();
    };
    this.$saveButton.onclick = () => {
      this.saveImage();
    };
    this.$resultButton.onclick = () => {
      this.showImage();
    };
    this.$colsCount.onchange = (e) => {
      this.colsCount = +e.target.value;
    };
    this.$rowsCount.onchange = (e) => {
      this.rowsCount = +e.target.value;
    };
    this.$pauseTime.onchange = (e) => {
      this.pauseTime = +e.target.value;
    };
    this.$highlightTime.onchange = (e) => {
      this.highlightTime = +e.target.value;
    };
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        if (this.timeoutId && this.$cell && !this.cellSaved) {
          const x = this.$cell.getAttribute("data-x");
          const y = this.$cell.getAttribute("data-y");
          this.resultArr.push({ x, y });
          this.cellSaved = true;
        }
      } else if (e.code === "KeyQ") {
        this.startButtonHandler();
      }
    });
  }

  showImage() {
    this.generateTable(true);
  }

  saveImage() {
    domtoimage.toJpeg(this.$table).then(function (dataUrl) {
      const link = document.createElement("a");
      link.download = "sample-test.jpeg";
      link.href = dataUrl;
      link.click();
    });
  }
}
