const board = document.getElementById('board');
const cells = Array.from(document.querySelectorAll('[data-cell]'));
const message = document.getElementById('message');
const messageText = document.getElementById('messageText');
const restartBtn = document.getElementById('restartBtn');
const X_CLASS = 'x';
const O_CLASS = 'o';
let currentPlayer = X_CLASS;
let boardState;

initGame();

restartBtn.addEventListener('click', initGame);

function initGame() {
    boardState = Array(9).fill(null);
    cells.forEach(cell => {
        cell.classList.remove(X_CLASS, O_CLASS);
        cell.textContent = '';
        cell.addEventListener('click', handleCellClick, { once: true });
    });
    setBoardHoverClass();
    message.classList.remove('active');
}

function handleCellClick(e) {
    const cell = e.target;
    const cellIndex = cells.indexOf(cell);
    if (!boardState[cellIndex]) {
        boardState[cellIndex] = currentPlayer;
        cell.classList.add(currentPlayer);
        cell.textContent = currentPlayer.toUpperCase();
        if (checkWinner(currentPlayer)) {
            displayWinner(false);
        } else if (boardState.every(cell => cell !== null)) {
            displayWinner(true);
        } else {
            swapPlayers();
            setBoardHoverClass();
        }
    }
}

function swapPlayers() {
    currentPlayer = currentPlayer === X_CLASS ? O_CLASS : X_CLASS;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS, O_CLASS);
    board.classList.add(currentPlayer);
}

function checkWinner(player) {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winConditions.some(combination => {
        return combination.every(index => boardState[index] === player);
    });
}

function displayWinner(draw) {
    messageText.innerText = draw ? 'Draw!' : `${currentPlayer.toUpperCase()} Wins!`;
    message.classList.add('active');
}

