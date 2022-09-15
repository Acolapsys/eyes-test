import App from "./App.js";

const config = {
  cols: 50,
  rows: 50,
  highlightTime: 500,
  pauseTime: 1000
};

const app = new App(config);
app.generateTable();
