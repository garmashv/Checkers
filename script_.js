class Checker { // шашка
    constructor(color, isKing, posX, posY) {
        this.color = color;
        this.isKing = false;
        this.posX = posX;
        this.posY = posY;
        this.cellForMove1 = null;
        this.cellForMove2 = null;
    }
}

class Cell { // клетка
    constructor(color, posX, posY) {
        this.color = color;
        this.posX = posX;
        this.posY = posY;
        this.currentChecker = null;
        // this.id = color + posX + posY;
    }
    appendChecker(currentChecker) {
        this.currentChecker = currentChecker;
    }
    removeChecker() {
        this.currentChecker = null;
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
                    let currentChecker = new Checker('black', false, i, j);
                    this.boardCells[i][j].appendChecker(currentChecker);
                }
            }
        }
        for (let j = 0; j < 3; j++) {
            for (let i = 0; i < boardSize; i++) {
                if (this.boardCells[i][j].color === 'black')
                {
                    if (this.boardCells[i][j].currentChecker.color === 'black')
                    {
                        if (i-1 >= 0) {
                            this.boardCells[i][j].currentChecker.cellForMove1 = [i-1, j+1];
                            // тут или не тут должна быть проверка на выход за пределы доски
                            // console.log(this.boardCells[i][j].currentChecker);
                            // console.log(this.boardCells[i][j].currentChecker.cellForMove1);
                            // формирование клеток хода реализовать отдельным методом <---------------------------------------
                        }
                    }
                }
            }
        }
        for (let j = boardSize-3; j < boardSize; j++) {
            for (let i = 0; i < boardSize; i++) {
                if (this.boardCells[i][j].color === 'black')
                {
                    let currentChecker = new Checker('white', false, i, j);
                    this.boardCells[i][j].appendChecker(currentChecker);
                }
            }
        }
    }
    clickProcessing(posX, posY) {
        // принимает координаты куда кликнули
        // вызываем этот метод в событии клика
        console.log(posY, posX);
    }
}

class DrawGame {
    drawBoard(board) {
        document.body.innerHTML = '';
        let body = document.querySelector('body');
        let tblBody = document.createElement("tbody");
        let tbl = document.createElement("table");
        for (let j = 0; j < boardSize; j++) {
            let row = document.createElement("tr");
            for (let i = 0; i < boardSize; i++) {
                let cell = document.createElement("td");
                cell.setAttribute('align', 'center');
                cell.setAttribute('valign', 'center');
                if(board.boardCells[i][j].color === 'black') {
                    cell.setAttribute('bgcolor', 'gray');
                }
                if (board.boardCells[i][j].currentChecker) {
                    let checker = document.createElement('img');
                    if(board.boardCells[i][j].currentChecker.color === 'black') {
                        checker.setAttribute('src', '/checkers/checkerBlack.png');
                    } else {
                        checker.setAttribute('src', '/checkers/checkerWhite.png');
                    }
                    checker.setAttribute('width', '30');
                    checker.setAttribute('height', '30');
                    cell.appendChild(checker);
                }
                row.appendChild(cell);
            }
            tblBody.appendChild(row);
        }
        tbl.appendChild(tblBody);
        body.appendChild(tbl);
        tbl.setAttribute("border", "2");
    }
}

boardSize = 8;
board = new Board(boardSize);
board.placeCheckers(boardSize);

newGame = new DrawGame();
newGame.drawBoard(board);

/*
alert('REMOVE');
let currentChecker = new Checker('black', false, 6, 2);
board.boardCells[6][2].removeChecker();
newGame.drawBoard(board);

alert('APPEND');
currentChecker = new Checker('black', false, 7, 3);
board.boardCells[7][3].appendChecker(currentChecker);
newGame.drawBoard(board);
*/

document.addEventListener("click", event=>checkerClick(event));

function checkerClick(event) {
    let clickedElement = event.target;
    if (clickedElement.tagName === 'IMG') {
        posY = clickedElement.parentNode.cellIndex;
        posX = clickedElement.parentNode.parentElement.rowIndex;
    }

    board.clickProcessing(posX, posY);
}