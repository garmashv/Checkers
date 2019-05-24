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
    }
}

class Board { // доска
    constructor(boardSize) {
        this.boardSize = boardSize;
        this.boardCells = [];
        for (let j = 0; j < boardSize; j++) {
            this.boardCells[j] = [];
            for (let i = 0; i < boardSize; i++) {
                var color = (i + j) % 2 === 0 ? "black" : "white";
                this.boardCells[j][i] = new Cell(color, i, j);
            }
        }
    }
    placeCheckers(boardSize) {
        for (let j = 0; j < 3; j++) {
            for (let i = 0; i < boardSize; i++) {
                if (this.boardCells[i][j].color === 'black')
                {
                    let currentChecker = new Checker(this.boardCells[i][j].color, false, i, j);
                    this.boardCells[i][j].appendChecker(currentChecker);
                }

            }
        }
        for (let j = boardSize-3; j < boardSize; j++) {
            for (let i = 0; i < boardSize; i++) {
                if (this.boardCells[i][j].color === 'white')
                {
                    let currentChecker = new Checker(this.boardCells[i][j].color, false, i, j);
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

class DrawGame {
    static drawBoard() {
        let body = document.querySelector('body');
        let tblBody = document.createElement("tbody");
        let tbl = document.createElement("table");
        for (let j = 0; j < 8; j++) {
            let row = document.createElement("tr");
            for (let i = 0; i < 8; i++) {
                let cell = document.createElement("td");
                cell.setAttribute('align', 'center');
                cell.setAttribute('valign', 'center');
                if (board.boardCells[i][j].currentChecker) {
                    let checker = document.createElement('img');
                    if(board.boardCells[i][j].currentChecker.color === 'black') {
                        checker.setAttribute('src', '/checkers/checkerBlack.png');
                    } else {
                        checker.setAttribute('src', '/checkers/checkerWhite.png');
                    }
                    checker.setAttribute('width', '30');
                    checker.setAttribute('height', '30');
                    //checker.setAttribute();
                    cell.appendChild(checker);
                }
                row.appendChild(cell);
            }
            tblBody.appendChild(row);
            tbl.appendChild(tblBody);
            body.appendChild(tbl);
            tbl.setAttribute("border", "2");
            tbl.setAttribute("id", "board");
        }
    }
}

DrawGame.drawBoard();
