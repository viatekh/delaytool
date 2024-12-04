window.onload = function () {
  const canvas = document.getElementById("gridCanvas");
  const ctx = canvas.getContext("2d");
  const addBoxButton = document.getElementById("add-box");
  const boxControlsContainer = document.getElementById("box-controls");

  canvas.width = window.innerWidth * 0.8;
  canvas.height = window.innerHeight;

  const gridSize = 50; // Grid size in pixels for 1 meter
  const gridLength = 10; // Extends -10m to +10m
  let boxes = [];

  function drawGrid() {
    const centerX = canvas.width / 2;
    const bottomY = canvas.height - gridSize; // Y=0 is at the bottom of the screen

    for (let i = -gridLength; i <= gridLength; i += 0.5) {
      const x = centerX + i * gridSize;

      // Draw vertical grid lines
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.strokeStyle = i === 0 ? "black" : "lightgray";
      ctx.lineWidth = i % 0.5 === 0 ? 1 : 0.5;
      ctx.stroke();

      // Bottom X-axis (in meters)
      ctx.beginPath();
      ctx.moveTo(x, bottomY - 5);
      ctx.lineTo(x, bottomY + 5);
      ctx.strokeStyle = "black";
      ctx.stroke();

      ctx.fillStyle = "black";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(i.toFixed(1), x, bottomY + 20);
    }

    // Draw Y=0 line
    ctx.beginPath();
    ctx.moveTo(0, bottomY);
    ctx.lineTo(canvas.width, bottomY);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function drawBoxes() {
    const centerX = canvas.width / 2;

    boxes.forEach((box, index) => {
      const x = centerX + box.x * gridSize;
      const y = canvas.height - gridSize - index * gridSize; // Y = 0 for first box

      const width = box.hornLength * gridSize;

      // Draw box
      ctx.fillStyle = box.color;
      ctx.fillRect(x - width, y - 20, width, 20);

      // Draw left black line
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x - width, y - 20);
      ctx.lineTo(x - width, y);
      ctx.strokeStyle = "black";
      ctx.stroke();

      // Draw the box name text to the right of the box
      ctx.fillStyle = "black";
      ctx.font = "12px Arial";
      ctx.textAlign = "left";
      ctx.fillText(box.name, x + 5, y - 5); // 5px padding to the right

      // Draw the dotted delay line (offset by delay)
      const delayOffset = -box.delay / gridSize; // Positive delay left, negative delay right
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(x - width + delayOffset * gridSize, 0);
      ctx.lineTo(x - width + delayOffset * gridSize, canvas.height);
      ctx.strokeStyle = "gray";
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw horizontal line connecting box to dotted delay line
      ctx.beginPath();
      ctx.moveTo(x - width, y - 10); // 10px above the box
      ctx.lineTo(x - width + delayOffset * gridSize, y - 10);
      ctx.strokeStyle = "gray";
      ctx.stroke();
    });
  }

  function updateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawBoxes();
  }

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function createBoxControls(index) {
    const box = boxes[index];
    const boxControlDiv = document.createElement("div");
    boxControlDiv.classList.add("box-controls");

    boxControlDiv.innerHTML = `
      <label for="box-${index}-name">Name: </label>
      <input type="text" id="box-${index}-name" value="${box.name}">
      <br>
      <label for="box-${index}-x">X Position (meters): </label>
      <input type="number" id="box-${index}-x" value="${box.x}" step="0.1">
      <br>
      <label for="box-${index}-horn-length">Horn Length (meters): </label>
      <input type="number" id="box-${index}-horn-length" value="${box.hornLength}" step="0.1">
      <br>
      <label for="box-${index}-delay">Delay (ms): </label>
      <input type="number" id="box-${index}-delay" value="${box.delay}" step="0.1">
    `;

    boxControlDiv.querySelector(`#box-${index}-name`).addEventListener("input", (e) => {
      box.name = e.target.value;
      updateCanvas();
    });

    boxControlDiv.querySelector(`#box-${index}-x`).addEventListener("input", (e) => {
      box.x = parseFloat(e.target.value);
      updateCanvas();
    });

    boxControlDiv.querySelector(`#box-${index}-horn-length`).addEventListener("input", (e) => {
      box.hornLength = parseFloat(e.target.value);
      updateCanvas();
    });

    boxControlDiv.querySelector(`#box-${index}-delay`).addEventListener("input", (e) => {
      box.delay = parseFloat(e.target.value);
      updateCanvas();
    });

    boxControlsContainer.insertBefore(boxControlDiv, boxControlsContainer.firstChild);
  }

  addBoxButton.addEventListener("click", () => {
    const newBox = {
      x: 0,
      hornLength: 2, // Default horn length is 2 meters
      delay: 0,
      color: getRandomColor(),
      name: `Speaker ${boxes.length + 1}`,
    };

    boxes.push(newBox);
    createBoxControls(boxes.length - 1);
    updateCanvas();
  });

  updateCanvas();
};
