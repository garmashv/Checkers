class Checker { // шашка
    constructor(color, isKing, posX, posY) {
        this.color = color;
        this.isKing = false;
        this.posX = posX;
        this.posY = posY;
        //this.cellForMove1 = undefined;
        //this.cellForMove2 = undefined;
    }
}

class Cell { // клетка
    constructor(color, posX, posY) {
        this.color = color;
        this.posX = posX;
        this.posY = posY;
        this.currentChecker = null;
        this.highlighted = false;
    }
    getHighlited() {
        return this.highlighted;
    }
    setHighlited(isSet) {
        this.highlighted = isSet;
    }
    appendChecker(currentChecker) {
        this.currentChecker = currentChecker;
    }
    removeChecker() {
        this.currentChecker = null;
    }
    getPosX() {
        return this.posX;
    }
    getPosY() {
        return this.posY;
    }
}

class Board { // доска
    constructor(boardSize) {
        this.lastX = null;
        this.lastY = null;
        this.boardSize = boardSize;
        this.boardCells = [];
        this.currentMove = 'white';
        this.countBlack = 0;
        this.countWhite = 0;

        for (let j = 0; j < boardSize; j++) {
            this.boardCells[j] = [];
            for (let i = 0; i < boardSize; i++) {
                var color = (i + j) % 2 === 0 ? "black" : "white";
                this.boardCells[j][i] = new Cell(color, i, j);
            }
        }
    }
    placeCheckers(boardSize) { // разместить все шашки
        for (let j = 0; j < 3; j++) {
            for (let i = 0; i < boardSize; i++) {
                if (this.boardCells[i][j].color === 'black')
                {
                    let currentChecker = new Checker('black', false, i, j);
                    this.boardCells[i][j].appendChecker(currentChecker);
                    this.countBlack++;
                }
            }
        }
        for (let j = boardSize-3; j < boardSize; j++) {
            for (let i = 0; i < boardSize; i++) {
                if (this.boardCells[i][j].color === 'black')
                {
                    let currentChecker = new Checker('white', false, i, j);
                    this.boardCells[i][j].appendChecker(currentChecker);
                    this.countWhite++;
                }
            }
        }
    }
    clickProcessing(posX, posY) { // принимает координаты куда кликнули. вызываем этот метод в событии клика

        if (this.boardCells[posY][posX].currentChecker) {

            this.unsetHighlited(board);

            if ((this.boardCells[posY][posX].currentChecker.color === 'black') && (this.currentMove === 'black')) {

                if ((posY+1 < 8) && (posX+1 < 8) && (this.boardCells[posY+1][posX+1].currentChecker === null))
                {
                    this.boardCells[posY+1][posX+1].setHighlited(true);
                } else {
                    if ((posY+2 < 8) && (posX+2 < 8) && (this.boardCells[posY+2][posX+2].currentChecker === null) &&
                    (this.boardCells[posY+1][posX+1].currentChecker.color !== this.boardCells[posY][posX].currentChecker.color))
                    {
                        this.boardCells[posY+2][posX+2].setHighlited(true);
                        captureType = 1;
                    }
                }

                if ((posY-1 >= 0) && (posX+1 < 8) && (this.boardCells[posY-1][posX+1].currentChecker === null)) {
                    this.boardCells[posY-1][posX+1].setHighlited(true);
                } else {
                    if ((posY-2 >= 0) && (posX+2 < 8) && (this.boardCells[posY-2][posX+2].currentChecker === null) &&
                    (this.boardCells[posY-1][posX+1].currentChecker.color !== this.boardCells[posY][posX].currentChecker.color))
                    {
                        this.boardCells[posY-2][posX+2].setHighlited(true);
                        captureType = 2;
                    }
                }
            }

            if ((this.boardCells[posY][posX].currentChecker.color === 'white') && (this.currentMove === 'white')) {

                if ((posY-1 >= 0) && (posX-1 >= 0) && (this.boardCells[posY-1][posX-1].currentChecker === null))
                {
                    this.boardCells[posY-1][posX-1].setHighlited(true);
                } else {
                    if ((posY-2 >= 0) && (posX-2 >= 0) && (this.boardCells[posY-2][posX-2].currentChecker === null) &&
                    (this.boardCells[posY-1][posX-1].currentChecker.color !== this.boardCells[posY][posX].currentChecker.color))
                    {
                        this.boardCells[posY-2][posX-2].setHighlited(true);
                        captureType = 3;
                    }
                }

                if ((posY+1 < 8) && (posX-1 >= 0) && (this.boardCells[posY+1][posX-1].currentChecker === null)) {
                    this.boardCells[posY+1][posX-1].setHighlited(true);
                } else {
                    if ((posY+2 < 8) && (posX-2 >= 0) && (this.boardCells[posY+2][posX-2].currentChecker === null) &&
                    (this.boardCells[posY+1][posX-1].currentChecker.color !== this.boardCells[posY][posX].currentChecker.color))
                    {
                        this.boardCells[posY+2][posX-2].setHighlited(true);
                        captureType = 4;
                    }
                }

            }

            this.lastX = posX;
            this.lastY = posY;

        } else {

            if (this.boardCells[posY][posX].getHighlited()) { // если кликнуто по хайлайтед то вызвать метод хода
                let colorOfMoved = this.boardCells[this.lastY][this.lastX].currentChecker.color; // перед удалением запомнить какого была цвета
                this.boardCells[this.lastY][this.lastX].removeChecker();
                let currentChecker = new Checker(colorOfMoved, false, posX, posY);
                this.boardCells[posY][posX].appendChecker(currentChecker);
                this.unsetHighlited(board); // очистить подсветку

                if ((Math.abs(posX-this.lastX) > 1) && (Math.abs(posY-this.lastY))) { // для проверки боя
                    switch (captureType) {
                        case 1:
                            this.boardCells[this.lastY+1][this.lastX+1].removeChecker(); // бьем черной правую белую
                            this.countWhite--;
                            break;
                        case 2:
                            this.boardCells[this.lastY-1][this.lastX+1].removeChecker(); //
                            this.countWhite--;
                            break;
                        case 3:
                            this.boardCells[this.lastY-1][this.lastX-1].removeChecker();
                            this.countBlack--;
                            break;
                        case 4:
                            this.boardCells[this.lastY+1][this.lastX-1].removeChecker();
                            this.countBlack--;
                            break;
                    }
                }

                if (this.currentMove === 'white') {
                    this.currentMove = 'black';
                } else { this.currentMove = 'white'; }

            }

        }

        newGame.drawBoard(board);
        newGame.drawCurrentMove(this.currentMove);
        newGame.drawCountBlack(this.countBlack);
        newGame.drawCountWhite(this.countWhite);
    }

    unsetHighlited(board) {
        for (let j = 0; j < board.boardSize; j++) {
            for (let i = 0; i < board.boardSize; i++) {
                board.boardCells[i][j].setHighlited(false);
            }
        }
    }
}

class DrawGame {
    drawBoard(board) { // перерисовывается доска (визуально)
        document.querySelector('#board').innerHTML = '';
        let body = document.querySelector('#board');
        let tblBody = document.createElement("tbody");
        let tbl = document.createElement("table");
        for (let j = 0; j < boardSize; j++) {
            let row = document.createElement("tr");
            for (let i = 0; i < boardSize; i++) {
                let cell = document.createElement("td");
                cell.setAttribute('align', 'center');
                cell.setAttribute('valign', 'center');
                if (board.boardCells[i][j].color === 'black') {
                    if (board.boardCells[i][j].getHighlited()) {
                        cell.setAttribute('bgcolor', 'blue');
                    } else {
                        cell.setAttribute('bgcolor', 'gray');
                    }
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

    drawCurrentMove(currentMove) {
        let currentMoveColor = document.createElement('p');
        currentMoveColor.setAttribute('id', 'currentMove');
        document.querySelector('#currentMove').innerHTML = 'Current move: ' + currentMove.toUpperCase();
    }

    drawCountBlack(countBlack) {
        let countBlackP = document.createElement('p');
        countBlackP.setAttribute('id', 'countBlack');
        document.querySelector('#countBlack').innerHTML = 'Count Black: ' + countBlack;
    }

    drawCountWhite(countWhite) {
        let countWhiteP = document.createElement('p');
        countWhiteP.setAttribute('id', 'countWhite');
        document.querySelector('#countWhite').innerHTML = 'Count White: ' + countWhite;
    }

}

function checkerClick(event) {
    let clickedElement = event.target;
    if (clickedElement.tagName === 'IMG') {
        posY = clickedElement.parentNode.cellIndex;
        posX = clickedElement.parentNode.parentElement.rowIndex;
    } else {
        posY = clickedElement.cellIndex;
        posX = clickedElement.parentElement.rowIndex;
    }
    board.clickProcessing(posX, posY);
}

boardSize = 8;
board = new Board(boardSize);
board.placeCheckers(boardSize);
newGame = new DrawGame();
newGame.drawBoard(board);
newGame.drawCountBlack(board.countBlack);
newGame.drawCountWhite(board.countWhite);

let currentMove = 'white';

let captureType = 0;

document.querySelector('#currentMove').innerHTML = 'Current move: ' + currentMove.toUpperCase();
document.addEventListener("click", event=>checkerClick(event));