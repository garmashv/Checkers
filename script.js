var body = document.querySelector('body');
var tbl = document.createElement("table");
var tblBody = document.createElement("tbody");
var clickedElement; // кликнутый объект
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
    if (clickedElement !== undefined) clickedElement.style.backgroundColor = ''; // ------- непонятно зачем? :)
    clickedElement = event.target; // вытаскием из события "клик" эл-т, по которому кликнули

    if (event.target.tagName === 'IMG') { // если клик именно по шашке (рис.) а не по клетке, etc.
        clickedCheckerId = event.target.getAttribute('id'); // id кликнутой шашки из события (клика)
        clickedChecker = document.getElementById(clickedCheckerId); // из id кликнутой шашки получаем сам эл-т
        cellArray = clickedElement.parentNode.getAttribute('id').split('_'); // массив cellArray["cell", "7", "1"]
        currentCell = clickedElement.parentNode; // клетка (с шашкой) по которой был клик,
        currentCell.classList.add('currentCell'); // подсвечиваем ее синей рамкой

        // определяем, какая шашка кликнута - black или white и формируем id-шники клеток возможного хода
        if (clickedChecker.className === 'black') { // если черная, то для хода - 2 диагональные верхние
            adjacentCellId1 = cellArray[0] + '_' + (parseInt(cellArray[1])-1) + '_' + (parseInt(cellArray[2])-1);
            adjacentCellId2 = cellArray[0] + '_' + (parseInt(cellArray[1])-1) + '_' + (parseInt(cellArray[2])+1);
            postCaptureCellId1 = cellArray[0] + '_' + (parseInt(cellArray[1])-2) + '_' + (parseInt(cellArray[2])-2);
            postCaptureCellId2 = cellArray[0] + '_' + (parseInt(cellArray[1])-2) + '_' + (parseInt(cellArray[2])+2);
        }
        if (clickedChecker.className === 'white') { // если белая, то для хода - 2 диагональные нижние
            adjacentCellId1 = cellArray[0] + '_' + (parseInt(cellArray[1])+1) + '_' + (parseInt(cellArray[2])-1);
            adjacentCellId2 = cellArray[0] + '_' + (parseInt(cellArray[1])+1) + '_' + (parseInt(cellArray[2])+1);
            postCaptureCellId1 = cellArray[0] + '_' + (parseInt(cellArray[1])+2) + '_' + (parseInt(cellArray[2])-2);
            postCaptureCellId2 = cellArray[0] + '_' + (parseInt(cellArray[1])+2) + '_' + (parseInt(cellArray[2])+2);
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
        currentCell.classList.remove('currentCell'); // убираем синюю рамку после хода
        moveChecker();
    }
}

function captureChecker() {

    alert('CAPTURE!!!');
    adjacentCell1.classList.remove('blue'); // убираем подсветку клеток хода
    adjacentCell2.classList.remove('blue');

    if (adjacentCell1.childNodes.length > 1) { // если в этой клетке есть шашка для боя,
        while (adjacentCell1.firstChild) {
            adjacentCell1.removeChild(adjacentCell1.firstChild); // то удаляем битую шашку с доски
        }
        postCaptureCell1 = document.getElementById(postCaptureCellId1); // id клетки куда перепрыгиваем
        postCaptureCell1.appendChild(clickedChecker); // перепрыгиваем через битую шашку
    }
    if (adjacentCell2.childNodes.length > 1) { // если в этой клетке есть шашка для боя,
        while (adjacentCell2.firstChild) {
            adjacentCell2.removeChild(adjacentCell2.firstChild); // удаляем битую шашку с доски
        }
        postCaptureCell2 = document.getElementById(postCaptureCellId2); // id клетки куда перепрыгиваем
        postCaptureCell2.appendChild(clickedChecker); // перепрыгиваем через битую шашку
    }
    currentCell.classList.remove('currentCell');
}

function moveChecker() {
    if (event.target.classList.contains('blue')) { // если кликнутая клетка была подсвечена,
        event.target.appendChild(clickedChecker); // то ходим на нее, т.е перемещение шашки
        document.querySelectorAll('.blue').forEach(function(item){
            item.classList.remove('blue'); // гасим подсвеченные клетки после хода
        });
    }

}