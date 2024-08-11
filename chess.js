const chessboard = document.getElementById('chessboard');

// Initial board setup
const initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

const boardState = JSON.parse(JSON.stringify(initialBoard));
let selectedPiece = null;
let selectedSquare = null;
let isWhiteTurn = true;

function renderBoard() {
    chessboard.innerHTML = '';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.className = 'square ' + ((row + col) % 2 === 0 ? 'white' : 'black');
            square.dataset.row = row;
            square.dataset.col = col;

            const piece = boardState[row][col];
            square.innerText = piece;

            square.addEventListener('click', () => onSquareClick(row, col));

            if (selectedSquare && selectedSquare.row === row && selectedSquare.col === col) {
                square.classList.add('selected');
            }

            chessboard.appendChild(square);
        }
    }
}

function onSquareClick(row, col) {
    const piece = boardState[row][col];

    if (selectedPiece) {
        if (isValidMove(selectedSquare.row, selectedSquare.col, row, col)) {
            boardState[row][col] = selectedPiece;
            boardState[selectedSquare.row][selectedSquare.col] = '';
            selectedPiece = null;
            selectedSquare = null;
            isWhiteTurn = !isWhiteTurn;
            renderBoard();
        }
    } else if (piece) {
        if ((isWhiteTurn && piece === piece.toUpperCase()) || (!isWhiteTurn && piece === piece.toLowerCase())) {
            selectedPiece = piece;
            selectedSquare = { row, col };
            renderBoard();
        }
    }
}

function isValidMove(startRow, startCol, endRow, endCol) {
    const piece = boardState[startRow][startCol].toLowerCase();
    const targetPiece = boardState[endRow][endCol];

    if (targetPiece && ((isWhiteTurn && targetPiece === targetPiece.toUpperCase()) || (!isWhiteTurn && targetPiece === targetPiece.toLowerCase()))) {
        return false; // Can't capture your own piece
    }

    switch (piece) {
        case 'p':
            return isValidPawnMove(startRow, startCol, endRow, endCol);
        case 'r':
            return isValidRookMove(startRow, startCol, endRow, endCol);
        case 'n':
            return isValidKnightMove(startRow, startCol, endRow, endCol);
        case 'b':
            return isValidBishopMove(startRow, startCol, endRow, endCol);
        case 'q':
            return isValidQueenMove(startRow, startCol, endRow, endCol);
        case 'k':
            return isValidKingMove(startRow, startCol, endRow, endCol);
        default:
            return false;
    }
}

function isValidPawnMove(startRow, startCol, endRow, endCol) {
    const direction = isWhiteTurn ? -1 : 1;
    const startPosition = isWhiteTurn ? 6 : 1;
    if (startCol === endCol) {
        if (boardState[endRow][endCol] === '') {
            if (startRow + direction === endRow) {
                return true;
            }
            if (startRow === startPosition && startRow + 2 * direction === endRow && boardState[startRow + direction][endCol] === '') {
                return true;
            }
        }
    } else if (Math.abs(startCol - endCol) === 1 && startRow + direction === endRow) {
        if (boardState[endRow][endCol] !== '' && boardState[endRow][endCol] !== boardState[endRow][endCol].toUpperCase()) {
            return true;
        }
    }
    return false;
}

function isValidRookMove(startRow, startCol, endRow, endCol) {
    if (startRow === endRow || startCol === endCol) {
        return !isPathBlocked(startRow, startCol, endRow, endCol);
    }
    return false;
}

function isValidKnightMove(startRow, startCol, endRow, endCol) {
    const rowDiff = Math.abs(startRow - endRow);
    const colDiff = Math.abs(startCol - endCol);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
}

function isValidBishopMove(startRow, startCol, endRow, endCol) {
    if (Math.abs(startRow - endRow) === Math.abs(startCol - endCol)) {
        return !isPathBlocked(startRow, startCol, endRow, endCol);
    }
    return false;
}

function isValidQueenMove(startRow, startCol, endRow, endCol) {
    return isValidRookMove(startRow, startCol, endRow, endCol) || isValidBishopMove(startRow, startCol, endRow, endCol);
}

function isValidKingMove(startRow, startCol, endRow, endCol) {
    const rowDiff = Math.abs(startRow - endRow);
    const colDiff = Math.abs(startCol - endCol);
    return rowDiff <= 1 && colDiff <= 1;
}

function isPathBlocked(startRow, startCol, endRow, endCol) {
    const rowStep = startRow < endRow ? 1 : startRow > endRow ? -1 : 0;
    const colStep = startCol < endCol ? 1 : startCol > endCol ? -1 : 0;

    let currentRow = startRow + rowStep;
    let currentCol = startCol + colStep;

    while (currentRow !== endRow || currentCol !== endCol) {
        if (boardState[currentRow][currentCol] !== '') {
            return true;
        }
        currentRow += rowStep;
        currentCol += colStep;
    }

    return false;
}

// Initialize the board
renderBoard();