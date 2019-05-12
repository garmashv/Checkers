var body = document.querySelector('body');
var tbl = document.createElement("table");
var tblBody = document.createElement("tbody");
var clickedCell;
var clickedCheckerId = '';

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

var checker1 = document.createElement('img'); // элемент шашка, устанавливаем свойства
checker1.setAttribute('id', 'checker_1');
checker1.setAttribute('src', '/checkers/checkerBlack.png');
checker1.setAttribute('width', '30');
checker1.setAttribute('height', '30');

var checker2 = document.createElement('img'); // элемент шашка, устанавливаем свойства
checker2.setAttribute('id', 'checker_2');
checker2.setAttribute('src', '/checkers/checkerWhite.png');
checker2.setAttribute('width', '30');
checker2.setAttribute('height', '30');

tbl.appendChild(tblBody); // append the <tbody> inside the <table>
body.appendChild(tbl); // put <table> in the <body>
tbl.setAttribute("border", "2"); // tbl border attribute to
tbl.setAttribute("id", "board");

document.querySelector('#cell_7_1').appendChild(checker1); // добавляем шашку в клетку (7,1)
document.querySelector('#cell_4_5').appendChild(checker2); // добавляем шашку в клетку (4,5)
document.getElementById("board").addEventListener("click", event=>checkerClick(event));
// и слушатель на клик по шашке ^^^^^^^^^^^^^^^^^^^^^^^^^^^^

function checkerClick(event) {
    if (clickedCell !== undefined) clickedCell.style.backgroundColor = '';
    clickedCell = event.target;

    if (event.target.tagName === 'IMG') { // если клик по именно по шашке (рис.) а не по клетке, etc.
        clickedCheckerId = event.target.getAttribute('id'); // id кликнутой шашки из события (клика)
        clickedChecker = document.getElementById(clickedCheckerId); // из id кликнутой шашки получаем сам эл-т --------------------------------
        let cellArray = clickedCell.parentNode.getAttribute('id').split('_'); // массив cellArray["cell", "7", "1"]
        let adjacentCellId1 = cellArray[0] + '_' + (parseInt(cellArray[1])-1) + '_' + (parseInt(cellArray[2])-1);
        let adjacentCellId2 = cellArray[0] + '_' + (parseInt(cellArray[1])-1) + '_' + (parseInt(cellArray[2])+1);
        // <<<----------------------------------------
        // let adjacentCellId3 = cellArray[0] + '_' + (parseInt(cellArray[1])+1) + '_' + (parseInt(cellArray[2])-1);
        // let adjacentCellId4 = cellArray[0] + '_' + (parseInt(cellArray[1])+1) + '_' + (parseInt(cellArray[2])+1);
        // ---------------------------------------->>>
        if (cellArray[2] > 0) { // если левая клетка возможного хода не за пределами доски
            var adjacentCell1 = document.getElementById(adjacentCellId1); // получаем эту клетку по ее id
            adjacentCell1.classList.add('blue'); // и подсвечиваем
            // <<<----------------------------------------
            // var adjacentCell3 = document.getElementById(adjacentCellId3);
            // adjacentCell3.classList.add('blue');
            // ---------------------------------------->>>
        }

        if (cellArray[1] > 0) { //если правая клетка возможного хода не за пределами доски
            var adjacentCell2 = document.getElementById(adjacentCellId2); // получаем эту клетку по ее id
            adjacentCell2.classList.add('blue'); // и подсвечиваем
            // <<<----------------------------------------
            // var adjacentCell4 = document.getElementById(adjacentCellId4);
            // adjacentCell4.classList.add('blue');
            // ---------------------------------------->>>
        }

    } else {

        if (event.target.classList.contains('blue')) {
            event.target.appendChild(clickedChecker); // ход, - перемещение шашки
            document.querySelectorAll('.blue').forEach(function(item){
                item.classList.remove('blue'); // тушим подсвеченные для хода клетки
            });
            // checker2.parentNode.getAttribute('id')
        }
    }
}