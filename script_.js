class Checker { // шашка
    constructor(color, isKing, posX, posY) {
        this.color = color;
        this.isKing = false;
        this.posX = posX; // текущая позиция шашки
        this.posY = posY;
    }
}

class Cell { // клетка
    constructor(color, posX, posY) {
        this.color = color;
        this.posX = posX; // позиция клетки
        this.posY = posY;
        this.currentChecker = null; // текущая шашка в данной клетке
        this.highlighted = false; // подсвечена ли клетка
    }
    getHighlighted() {
        return this.highlighted;
    }
    setHighlighted(isSet) {
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
        this.lastX = null; // позиция последней кликнутой шашки
        this.lastY = null;
        this.boardSize = boardSize; // размер доски
        this.boardCells = []; // массив клеток
        this.currentMove = 'white'; // у кого текущий ход
        this.countBlack = 0; // оставшиеся шашки
        this.countWhite = 0;
        this.triad = []; // "триады" для проверки боя
        this.captureFlag = false; // признак обязательного боя
        this.mayCapture = []; // массив клеток (шашек), которым разрешено бить
        this.lastCaptureColor = [];
        this.captureColor = [];

        for (let j = 0; j < boardSize; j++) { // формируем доску
            this.boardCells[j] = [];
            for (let i = 0; i < boardSize; i++) {
                var color = (i + j) % 2 === 0 ? "black" : "white";
                this.boardCells[j][i] = new Cell(color, i, j);
            }
        }
    }

    placeCheckers(boardSize) { // размещаем все шашки
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

    clickProcessing(posX, posY) { // получаем координаты из обработчика события клика


        // ********************************* for debug *********************************
        if (board.boardCells[posX][posY].currentChecker) {
            console.log(board.boardCells[posX][posY].currentChecker.color,
                board.boardCells[posX][posY].currentChecker.posX,
                board.boardCells[posX][posY].currentChecker.posY);
        } // ******************************* for debug *********************************

        if ((this.boardCells[posX][posY].currentChecker) ) { // если кликнули по шашке,

            if (this.captureFlag === false) { // и боя нет -

                this.unsetHighlighted(board); // погасить подсвеченные
                this.highlightMove(); // и вызвать метод подсветки клеток для хода

                // если кликнутая шашка того же цвета чей ход
                if (this.boardCells[posX][posY].currentChecker.color === this.currentMove) {
                    this.lastX = posX; // запомнить позицию последней кликнутой шашки
                    this.lastY = posY;
                }

            } else { // если кликнули по шашке, и бой есть - проверить...
                var self = this;
                this.mayCapture.forEach(function(element) { // ... принадлежит ли кликнутая Ш
                    if (element[0] === posX && element[1] === posY) { // массиву шашек кот. разрешен бой
                        self.lastX = posX; // если да, то запомнить ее координаты
                        self.lastY = posY;
                    }
                });
            }

        } else {

            if (this.boardCells[posX][posY].getHighlighted()) { // если кликнуто по подсвеченной клетке,
                console.log(posX, posY);


                if (this.lastX === null || this.lastY === null) { // (и последней кликнутой шашки нет)
                    return;
                }

                if (this.captureFlag === false) { // и нет боя -
                    this.moveChecker(); // вызываем метод хода;
                    this.passTheMove(); // передать ход
                    this.lastCaptureColor = []; // и обнулить массив где цвет последних бьющих

                } else { // если кликнуто по подсвеченной клетке и есть бой -
                    // (проверка на случай неправильного "вертикального" боя)
                    if (Math.abs(this.lastX - posX) === 0) return;
                    this.captureChecker(); // вызываем метод боя

                    this.checkCapture(); // начиная с этой строки и далее след. блок (if) малообъясним :)
                    if (this.lastCaptureColor.length > 0) { // если массив где цвет последних бьющих...
                        if (this.checkCapture() === this.lastCaptureColor[this.lastCaptureColor.length - 1]) {
                            this.checkCapture(); // ^^^^^^^^ и эта строка - так надо :)
                        } else { // вобщем это все сводится к тому, чтоб после каждого боя проверять еще на
                            this.passTheMove(); // бой (того же цвета), и если его нет, то передавать ход
                            this.checkCapture();
                        }
                    }

                }

                this.lastX = null; // очищаем позицию последней кликнутой шашки
                this.lastY = null;
                this.checkCapture(); //  проверка боя

            }

        }

        newGame.drawBoard(board); // перерисовать доску
        newGame.drawCurrentMove(this.currentMove); // обновить индикацию чей ход,
        newGame.drawCountBlack(this.countBlack); // и сколько осталось шашек
        newGame.drawCountWhite(this.countWhite);

    }

    unsetHighlighted() { // погасить все подсвеченные клетки
        for (let j = 0; j < this.boardSize; j++) {
            for (let i = 0; i < this.boardSize; i++) {
                this.boardCells[i][j].setHighlighted(false);
            }
        }
    }

    highlightMove() { // подсветка клеток для хода
        if ((this.boardCells[posX][posY].currentChecker.color === 'black') && (this.currentMove === 'black')) {

            if ((posX+1 < this.boardSize) && (posY+1 < this.boardSize) &&
                (this.boardCells[posX+1][posY+1].currentChecker === null))
            {
                this.boardCells[posX+1][posY+1].setHighlighted(true);
            }
            if ((posX-1 >= 0) && (posY+1 < this.boardSize) && (this.boardCells[posX-1][posY+1].currentChecker === null)) {
                this.boardCells[posX-1][posY+1].setHighlighted(true);
            }
        }
        if ((this.boardCells[posX][posY].currentChecker.color === 'white') && (this.currentMove === 'white')) {

            if ((posX-1 >= 0) && (posY-1 >= 0) && (this.boardCells[posX-1][posY-1].currentChecker === null))
            {
                this.boardCells[posX-1][posY-1].setHighlighted(true);
            }
            if ((posX+1 < this.boardSize) && (posY-1 >= 0) && (this.boardCells[posX+1][posY-1].currentChecker === null)) {
                this.boardCells[posX+1][posY-1].setHighlighted(true);
            }
        }
    }

    moveChecker() { // ход шашки
        let colorOfMoved = this.boardCells[this.lastX][this.lastY].currentChecker.color; // перед удалением запомнить,
        // какого была цвета ^^^^^^^^^^^^^^
        this.boardCells[this.lastX][this.lastY].removeChecker(); // ... убрать шашку, которой ходим...
        let currentChecker = new Checker(colorOfMoved, false, posX, posY);
        this.boardCells[posX][posY].appendChecker(currentChecker); /// ... и переставить на клетку куда ходим
        this.unsetHighlighted(board); // очистить подсветку
    }

    captureChecker() { // бой шашки
        let colorOfMoved = this.boardCells[this.lastX][this.lastY].currentChecker.color; // запоминаем цвет бьющей
        this.boardCells[this.lastX][this.lastY].removeChecker();
        let currentChecker = new Checker(colorOfMoved, false, posX, posY);
        this.boardCells[posX][posY].appendChecker(currentChecker); // бьющая - в новую позицию

        if (this.boardCells[(posX + this.lastX) / 2][(posY + this.lastY) / 2].currentChecker.color === 'black') {
            this.countBlack--;
            this.lastCaptureColor.push('white'); // это для множественного боя в методе clickProcessing()
        } else {
            this.countWhite--;
            this.lastCaptureColor.push('black');
        } // координаты битой - среднее арифм. между старой и новой позицией бьющей
        this.boardCells[(posX + this.lastX) / 2][(posY + this.lastY) / 2].removeChecker(); // убираем битую
        this.unsetHighlighted();
    }

    passTheMove() { // переход хода
        if (this.currentMove === 'white') {
            this.currentMove = 'black';
        } else {
            this.currentMove = 'white';
        }
    }

    checkCapture() { // проверка на обязательй бой и подсветка клеток для боя

        this.captureFlag = false; // снять флаг боя
        this.mayCapture = []; // обнуляем массив клеток (шашек), которым разрешено бить
        this.captureColor = [];

        for (let j = 0; j < this.boardSize-3; j = j + 2) { // разбивка доски на "триады" (3 на 3 клетки),
            this.triad[j] = []; // первые 9 "триад"
            for (let i = 0; i < this.boardSize-3; i = i + 2) {
                this.triad[j][i] = [];
                this.triad[j][i][1] = this.boardCells[i][j];
                this.triad[j][i][2] = this.boardCells[i+2][j];
                this.triad[j][i][3] = this.boardCells[i+1][j+1];
                this.triad[j][i][4] = this.boardCells[i][j+2];
                this.triad[j][i][5] = this.boardCells[i+2][j+2];
            }
        }

        for (let j = 1; j < this.boardSize-2; j = j + 2) { // вторые 9 "триад"
            this.triad[j] = [];
            for (let i = 1; i < this.boardSize-2; i = i + 2) {
                this.triad[j][i] = [];
                this.triad[j][i][1] = this.boardCells[i][j];
                this.triad[j][i][2] = this.boardCells[i+2][j];
                this.triad[j][i][3] = this.boardCells[i+1][j+1];
                this.triad[j][i][4] = this.boardCells[i][j+2];
                this.triad[j][i][5] = this.boardCells[i+2][j+2];
            }
        }

        for (let j = 0; j < this.boardSize-3; j = j + 2) { // проверка по триадам на возможный бой

            for (let i = 0; i < this.boardSize-3; i = i + 2) {

                if (this.currentMove === 'white') { // если ходят белые...

                    if (this.triad[j][i][5].currentChecker && this.triad[j][i][3].currentChecker) {

                        if((((this.triad[j][i][5].currentChecker.color).charCodeAt(0) -
                            (this.triad[j][i][3].currentChecker.color).charCodeAt(0)) > 0) && // ... и белая может бить
                            (this.triad[j][i][1].currentChecker === null)) {

                            this.triad[j][i][1].setHighlighted(true); // подсветить клетку куда прыгает бьющая
                            this.captureFlag = true;
                            // передать шашку которая может бить в "массив бьющих"
                            this.mayCapture.push([this.triad[j][i][5].currentChecker.posX,
                                this.triad[j][i][5].currentChecker.posY]);
                            // заполняем массив где цвет последних бьющих
                            this.captureColor.push(this.triad[j][i][5].currentChecker.color);
                        }
                    }

                    if (this.triad[j][i][4].currentChecker && this.triad[j][i][3].currentChecker) {

                        if((((this.triad[j][i][4].currentChecker.color).charCodeAt(0) -
                            (this.triad[j][i][3].currentChecker.color).charCodeAt(0)) > 0) &&
                            (this.triad[j][i][2].currentChecker === null)) {

                            this.triad[j][i][2].setHighlighted(true);
                            this.captureFlag = true;
                            this.mayCapture.push([this.triad[j][i][4].currentChecker.posX,
                                this.triad[j][i][4].currentChecker.posY]);
                            this.captureColor.push(this.triad[j][i][4].currentChecker.color);
                        }
                    }
                }

                if (this.currentMove === 'black') {

                    if (this.triad[j][i][1].currentChecker && this.triad[j][i][3].currentChecker) {

                        if((((this.triad[j][i][1].currentChecker.color).charCodeAt(0) -
                            (this.triad[j][i][3].currentChecker.color).charCodeAt(0)) < 0) &&
                            (this.triad[j][i][5].currentChecker === null)) {

                            this.triad[j][i][5].setHighlighted(true);
                            this.captureFlag = true;
                            this.mayCapture.push([this.triad[j][i][1].currentChecker.posX,
                                this.triad[j][i][1].currentChecker.posY]);
                            this.captureColor.push(this.triad[j][i][1].currentChecker.color);
                        }
                    }

                    if (this.triad[j][i][2].currentChecker && this.triad[j][i][3].currentChecker) {

                        if((((this.triad[j][i][2].currentChecker.color).charCodeAt(0) -
                            (this.triad[j][i][3].currentChecker.color).charCodeAt(0)) < 0) &&
                            (this.triad[j][i][4].currentChecker === null)) {

                            this.triad[j][i][4].setHighlighted(true);
                            this.captureFlag = true;
                            this.mayCapture.push([this.triad[j][i][2].currentChecker.posX,
                                this.triad[j][i][2].currentChecker.posY]);
                            this.captureColor.push(this.triad[j][i][2].currentChecker.color);
                        }
                    }
                }
            }
        }

        for (let j = 1; j < board.boardSize-2; j = j + 2) { // проверка по триадам на возможный бой, 2-я часть триад

            for (let i = 1; i < board.boardSize-2; i = i + 2) {

                if (this.currentMove === 'white') {

                    if (this.triad[j][i][5].currentChecker && this.triad[j][i][3].currentChecker) {

                        if((((this.triad[j][i][5].currentChecker.color).charCodeAt(0) -
                            (this.triad[j][i][3].currentChecker.color).charCodeAt(0)) > 0) &&
                            (this.triad[j][i][1].currentChecker === null)) {

                            this.triad[j][i][1].setHighlighted(true);
                            this.captureFlag = true;
                            this.mayCapture.push([this.triad[j][i][5].currentChecker.posX,
                                this.triad[j][i][5].currentChecker.posY]);
                            this.captureColor.push(this.triad[j][i][5].currentChecker.color);
                        }
                    }

                    if (this.triad[j][i][4].currentChecker && this.triad[j][i][3].currentChecker) {

                        if((((this.triad[j][i][4].currentChecker.color).charCodeAt(0) -
                            (this.triad[j][i][3].currentChecker.color).charCodeAt(0)) > 0) &&
                            (this.triad[j][i][2].currentChecker === null)) {

                            this.triad[j][i][2].setHighlighted(true);
                            this.captureFlag = true;
                            this.mayCapture.push([this.triad[j][i][4].currentChecker.posX,
                                this.triad[j][i][4].currentChecker.posY]);
                            this.captureColor.push(this.triad[j][i][4].currentChecker.color);
                        }
                    }
                }

                if (this.currentMove === 'black') {
                    if (this.triad[j][i][1].currentChecker && this.triad[j][i][3].currentChecker) {

                        if((((this.triad[j][i][1].currentChecker.color).charCodeAt(0) -
                            (this.triad[j][i][3].currentChecker.color).charCodeAt(0)) < 0) &&
                            (this.triad[j][i][5].currentChecker === null)) {

                            this.triad[j][i][5].setHighlighted(true);
                            this.captureFlag = true;
                            this.mayCapture.push([this.triad[j][i][1].currentChecker.posX,
                                this.triad[j][i][1].currentChecker.posY]);
                            this.captureColor.push(this.triad[j][i][1].currentChecker.color);
                        }
                    }

                    if (this.triad[j][i][2].currentChecker && this.triad[j][i][3].currentChecker) {

                        if((((this.triad[j][i][2].currentChecker.color).charCodeAt(0) -
                            (this.triad[j][i][3].currentChecker.color).charCodeAt(0)) < 0) &&
                            (this.triad[j][i][4].currentChecker === null)) {

                            this.triad[j][i][4].setHighlighted(true);
                            this.captureFlag = true;
                            this.mayCapture.push([this.triad[j][i][2].currentChecker.posX,
                                this.triad[j][i][2].currentChecker.posY]);
                            this.captureColor.push(this.triad[j][i][2].currentChecker.color);
                        }
                    }
                }
            }
        }
        return this.captureColor[0]; // метод возвращает цвет шашки/ек (т.к. их 2) кот. может бить на данный момент
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
                if (board.boardCells[i][j].color === 'black') {
                    if (board.boardCells[i][j].getHighlighted()) {
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

    drawCurrentMove(currentMove) { // для индикации цвета текущего хода
        let currentMoveColor = document.createElement('p');
        currentMoveColor.setAttribute('id', 'currentMove');
        document.querySelector('#currentMove').innerHTML = 'Current move: ' + currentMove.toUpperCase();
    }

    drawCountBlack(countBlack) { // для отрисовки количества черных..
        let countBlackP = document.createElement('p');
        countBlackP.setAttribute('id', 'countBlack');
        document.querySelector('#countBlack').innerHTML = 'Count Black: ' + countBlack;
    }

    drawCountWhite(countWhite) { // ... и белых
        let countWhiteP = document.createElement('p');
        countWhiteP.setAttribute('id', 'countWhite');
        document.querySelector('#countWhite').innerHTML = 'Count White: ' + countWhite;
    }

}

function checkerClick(event) { // обработчик события клика
    let clickedElement = event.target; // из события клика получаем эл-т по которому кликнули
    if (clickedElement.tagName === 'IMG') { // если кликнуто по шашке (рисунку)
        posX = clickedElement.parentNode.cellIndex; // позиция X - индекс ячейки в строке таблицы
        posY = clickedElement.parentNode.parentElement.rowIndex; // позиция Y - номер строки в таблице
    } else { // если кликнуто просто по клетке
        posX = clickedElement.cellIndex;
        posY = clickedElement.parentElement.rowIndex;
    }
    board.clickProcessing(posX, posY); // вызываем метод обработки и передаем в него полученные координаты
}

boardSize = 8;
board = new Board(boardSize);
board.placeCheckers(boardSize);
newGame = new DrawGame();
newGame.drawBoard(board);
newGame.drawCountBlack(board.countBlack);
newGame.drawCountWhite(board.countWhite);

document.querySelector('#currentMove').innerHTML = 'Current move: WHITE';
document.addEventListener("click", event=>checkerClick(event));