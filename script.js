var body = document.querySelector('body');
var tbl = document.createElement("table");
var tblBody = document.createElement("tbody");
var clickedCell; // кликнутый объект
var clickedCheckerId = '';
var cellArray = []; // массив где id...

for (var j = 0; j < 8; j++) { // cells creation
    var row = document.createElement("tr"); // table row creation
    for (var i = 0; i < 8; i++) {
        var cell = document.createElement("td"); // put <td> at end of the table row
        var cellText = document.createTextNode(j + "," + i); // create element <td> and text node
        cell.setAttribute('id', 'cell_' + j + '_' + i);
        cell.setAttribute('innerHeight', '50'); //
        cell.setAttribute('innerWidth', '50'); //
        cell.appendChild(cellText); // Make text node the contents of <td> element
        row.appendChild(cell);
    }
    tblBody.appendChild(row); //row added to end of table body
}

var checker1 = document.createElement('img'); // черная шашка (рисунок), устанавливаем свойства
checker1.setAttribute('id', 'checker_1');
checker1.setAttribute('src', '/checkers/checkerBlack.png');
checker1.setAttribute('width', '30');
checker1.setAttribute('height', '30');
checker1.classList.add('black');

var checker2 = document.createElement('img');  // белая шашка (рисунок), устанавливаем свойства
checker2.setAttribute('id', 'checker_2');
checker2.setAttribute('src', '/checkers/checkerWhite.png');
checker2.setAttribute('width', '30');
checker2.setAttribute('height', '30');
checker2.classList.add('white');

tbl.appendChild(tblBody); // append the <tbody> inside the <table>
body.appendChild(tbl); // put <table> in the <body>
tbl.setAttribute("border", "2"); // tbl border attribute to
tbl.setAttribute("id", "board");

document.querySelector('#cell_7_1').appendChild(checker1); // добавляем шашку в клетку (7,1)
document.querySelector('#cell_1_5').appendChild(checker2); // добавляем шашку в клетку (4,5)
document.getElementById("board").addEventListener("click", event=>checkerClick(event));
// и слушатель на клик по шашке ^^^^^^^^^^^^^^^^^^^^^^^^^^^^

function checkerClick(event) {
    if (clickedCell !== undefined) clickedCell.style.backgroundColor = ''; // ------- непонятно зачем? :)
    clickedCell = event.target; // вытаскием из события "клик" эл-т, по которому кликнули

    if (event.target.tagName === 'IMG') { // если клик именно по шашке (рис.) а не по клетке, etc.
        clickedCheckerId = event.target.getAttribute('id'); // id кликнутой шашки из события (клика)
        clickedChecker = document.getElementById(clickedCheckerId); // из id кликнутой шашки получаем сам эл-т
        cellArray = clickedCell.parentNode.getAttribute('id').split('_'); // массив cellArray["cell", "7", "1"]

        // определяем, какая шашка кликнута - black или white и формируем id-шники клеток возможного хода
        if (clickedChecker.className === 'black') { // если черная, то для хода - 2 диагональные верхние
            adjacentCellId1 = cellArray[0] + '_' + (parseInt(cellArray[1])-1) + '_' + (parseInt(cellArray[2])-1);
            adjacentCellId2 = cellArray[0] + '_' + (parseInt(cellArray[1])-1) + '_' + (parseInt(cellArray[2])+1);
        }
        if (clickedChecker.className === 'white') { // если белая, то для хода - 2 диагональные нижние
            adjacentCellId1 = cellArray[0] + '_' + (parseInt(cellArray[1])+1) + '_' + (parseInt(cellArray[2])-1);
            adjacentCellId2 = cellArray[0] + '_' + (parseInt(cellArray[1])+1) + '_' + (parseInt(cellArray[2])+1);
        }
        if (cellArray[2] > 0) { // если левая клетка возможного хода не за пределами доски
            adjacentCell1 = document.getElementById(adjacentCellId1); // получаем эту клетку по ее id
            if (adjacentCell1.childNodes.length <= 1) { // и если там нет шашки
                adjacentCell1.classList.add('blue'); // то подсвечиваем
            } else {
                captureChecker();
            }
        }
        if (cellArray[1] > 0) { //если правая клетка возможного хода не за пределами доски
            adjacentCell2 = document.getElementById(adjacentCellId2); // получаем эту клетку по ее id
            if (adjacentCell2.childNodes.length <= 1) { // и если там нет шашки
                adjacentCell2.classList.add('blue'); // то подсвечиваем
            } else {
                captureChecker();
            }
        }

    } else {
        turnChecker();
    }
}

function captureChecker() {
    /*
        //формируем id клетки, куда прыжок по диаг. на 2 клетки через шашку под боем)
        postCaptureCellId = cellArray[0] + '_' + (parseInt(cellArray[1])-2) + '_' + (parseInt(cellArray[2])-2);
        postCaptureCell = document.getElementById(postCaptureCellId); // и получаем эту клетку по ее id
        postCaptureCell.classList.add('blue'); // а также подсвечиваем ее
        // формируем id клетки, которая под боем
        underCaptureCellId = cellArray[0] + '_' + (parseInt(cellArray[1])-1) + '_' + (parseInt(cellArray[2])-1);
        underCaptureCell = document.getElementById(underCaptureCellId); // и получаем эту клетку по ее id
        underCaptureCell.classList.add('red'); // а также подсвечиваем ее
    */
    alert('CAPTURE!!!');
/*
    postCaptureCell.appendChild(clickedChecker); // перепрыгиваем через битую шашку
    while (underCaptureCell.firstChild) {
        underCaptureCell.removeChild(underCaptureCell.firstChild); // удаляем битую шашку с доски
    }
    underCaptureCell.classList.remove('red'); // гасим все подсвеченные
    postCaptureCell.classList.remove('blue');
*/
}

function turnChecker() {
    if (event.target.classList.contains('blue')) { // если кликнутая клетка была подсвечена,
        event.target.appendChild(clickedChecker); // то ходим на нее, т.е перемещение шашки
        document.querySelectorAll('.blue').forEach(function(item){
            item.classList.remove('blue'); // гасим подсвеченные клетки после хода
        });
    }
}