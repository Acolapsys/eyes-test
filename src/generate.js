export const generateTable = ($table) => {
  $table.innerHTML = "";
  const makeCell = () => {
    const $el = document.createElement("td");
    $el.classList.add("cell");
    return $el;
  };
  const cellsArray = Array.from(Array(50), () =>
    Array.from(Array(50), () => makeCell())
  );

  cellsArray.forEach((row, rowIndex) => {
    const $row = document.createElement("tr");
    row.forEach(($cell, cellIndex) => {
      $row.append($cell);
      $cell.setAttribute("data-x", cellIndex);
      $cell.setAttribute("data-y", rowIndex);
    });
    $table.append($row);
  });

  const $circle = document.createElement("div");
  $circle.classList.add("circle");
  $table.append($circle);
};
