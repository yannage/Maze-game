const board = document.getElementById("board");
const redScore = document.getElementById("red-score");
const blackScore = document.getElementById("black-score");
const upBtn = document.getElementById("up");
const leftBtn = document.getElementById("left");
const rightBtn = document.getElementById("right");
const downBtn = document.getElementById("down");

let selectedPiece = null;
let currentPlayer = "red";
let scores = { red: 0, black: 0 };

// Initial board setup
const boardState = [
    [" ", "⚫", " ", "⚫", " ", "⚫", " ", "⚫"],
    ["⚫", " ", "⚫", " ", "⚫", " ", "⚫", " "],
    [" ", "⚫", " ", "⚫", " ", "⚫", " ", "⚫"],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    ["🔴", " ", "🔴", " ", "🔴", " ", "🔴", " "],
    [" ", "🔴", " ", "🔴", " ", "🔴", " ", "🔴"],
    ["🔴", " ", "🔴", " ", "🔴", " ", "🔴", " "]
];

// Render the board with visibility limit
function renderBoard() {
    board.innerHTML = "";
    boardState.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const div = document.createElement("div");
            div.classList.add("cell");
            div.classList.add((rowIndex + colIndex) % 2 === 0 ? "white" : "black");
            div.dataset.row = rowIndex;
            div.dataset.col = colIndex;

            // Visibility logic (only 4 blocks away)
            if (selectedPiece && Math.abs(rowIndex - selectedPiece.row) <= 4 && Math.abs(colIndex - selectedPiece.col) <= 4) {
                div.textContent = cell;
            } else {
                div.textContent = " ";
            }

            div.addEventListener("click", () => handleMove(rowIndex, colIndex));

            board.appendChild(div);
        });
    });
}

// Handle piece selection
function handleMove(row, col) {
    const piece = boardState[row][col];

    if (!selectedPiece && (piece === "🔴" || piece === "⚫")) {
        if ((currentPlayer === "red" && piece === "🔴") || (currentPlayer === "black" && piece === "⚫")) {
            selectedPiece = { row, col };
            updateControls();
        }
    }
    renderBoard();
}

// Update control buttons for allowed moves
function updateControls() {
    if (!selectedPiece) return;

    let { row, col } = selectedPiece;
    upBtn.hidden = !isValidMove(row, col, row - 1, col);
    downBtn.hidden = !isValidMove(row, col, row + 1, col);
    leftBtn.hidden = !isValidMove(row, col, row, col - 1);
    rightBtn.hidden = !isValidMove(row, col, row, col + 1);
}

// Check if a move is valid
function isValidMove(prevRow, prevCol, newRow, newCol) {
    if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) return false;
    if (boardState[newRow][newCol] !== " ") return false;
    return true;
}

// Move piece using arrow buttons
function movePiece(direction) {
    if (!selectedPiece) return;

    let { row, col } = selectedPiece;
    let newRow = row, newCol = col;

    if (direction === "up") newRow--;
    if (direction === "down") newRow++;
    if (direction === "left") newCol--;
    if (direction === "right") newCol++;

    if (isValidMove(row, col, newRow, newCol)) {
        boardState[newRow][newCol] = "🫡"; // Temporary salute emoji
        boardState[row][col] = " ";
        renderBoard();

        setTimeout(() => {
            boardState[newRow][newCol] = "😊"; // Return to normal
            selectedPiece = { row: newRow, col: newCol };
            renderBoard();
            updateControls();
        }, 500);

        // Switch turns
        currentPlayer = currentPlayer === "red" ? "black" : "red";
    }
}

// Add event listeners to buttons
upBtn.addEventListener("click", () => movePiece("up"));
downBtn.addEventListener("click", () => movePiece("down"));
leftBtn.addEventListener("click", () => movePiece("left"));
rightBtn.addEventListener("click", () => movePiece("right"));

// Initial render
renderBoard();