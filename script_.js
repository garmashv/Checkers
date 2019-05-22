class Checker { // шашка
    constructor(color, isKing, posX, posY) {
        this.color = color;
        this.isKing = false;
        this.posX = posX;
        this.posY = posY;
    }
}

class Cell { // клетка
    constructor(color, posX, posY) {
        this.color = color;
        this.posX = posX;
        this.posY = posY;
        this.currentChecker = null;
    }
    appendChecker(currentChecker) {
        this.currentChecker = currentChecker;
        //

    }

}

class Board { // доска
    constructor(boardSize) {
        this.boardSize = boardSize;
        this.boardCells = [];
        for (let i = 0; i < boardSize; i++) {
            this.boardCells[i] = [];
            for (let j = 0; j < boardSize; j++) {
                var color = (i + j) % 2 === 0 ? "black" : "white";
                this.boardCells[i][j] = new Cell(color, i, j);
            }
        }
    }
    placeCheckers(boardSize) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (this.boardCells[i][j].color === 'black')
                {
                    let currentChecker = new Checker('black', false, i, j);
                    this.boardCells[i][j].appendChecker(currentChecker);
                }
            }
        }
    }
}

boardSize = 8;
board = new Board(boardSize);

board.placeCheckers(boardSize);

console.log(board);