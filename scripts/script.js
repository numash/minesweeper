"use strict";

var FIELD_WIDTH = 10;
var FIELD_HEIGHT = 10;
var CELLNUMBER = FIELD_HEIGHT * FIELD_WIDTH;
var BOMBNUMBER = Math.round(CELLNUMBER * 0.15);
var MAX_FIELD_SIZE = Math.round(CELLNUMBER * 0.2);
var cells;
var bombsTargeted;

var CONTENT_TYPES = {
    EMPTY: 0,
    NUMBER: 1,
    BOMB: 2
}

function initField(){
    initCells();
    initBombs();
    initNumbers();
}

function initCells(){
    
    cells = [];
    
    for(var i = 0; i < CELLNUMBER; i++) {
        cells[i] = {
            id: i,
            isClosed: true,
            isFlaged: false,
            content: null,
            contentType: CONTENT_TYPES.EMPTY
        };
    }
    
    var container = document.getElementById("miner");
    
    cells.forEach(function(c){
        var cell = document.createElement("div");
        cell.className = "cells";
        cell.id = c.id;
        cell.onclick = openCell;
        cell.addEventListener("contextmenu", function(event) {      //right click
            event.preventDefault();
            flagCell(event);
            return false;
        }, false);      // cancel default menu

        container.appendChild(cell);
    });
}

function initBombs(){
    for (var i=0; i < BOMBNUMBER; i++){
        var randomId = Math.floor(Math.random() * (CELLNUMBER-1));      //from 0 to 99
        if (cells[randomId].contentType === CONTENT_TYPES.BOMB){
            i--;
            continue;
        } else{
            cells[randomId].contentType = CONTENT_TYPES.BOMB;
        }
    } 
    bombsTargeted = BOMBNUMBER;
    
    var counterNumber = document.getElementById("counterNumber");
    counterNumber.innerHTML = bombsTargeted;
}

function initNumbers(){
    cells.filter(function(c){
        return c.contentType === CONTENT_TYPES.BOMB;
    }).forEach(function(c){
        var neighbours = getCellNeighbours(c.id);
        neighbours.filter(function(n){
                return n.contentType !== CONTENT_TYPES.BOMB;
            }).forEach(function(n){
            if (n.contentType !== CONTENT_TYPES.NUMBER){
                n.contentType = CONTENT_TYPES.NUMBER;
                n.content = 1;
            } else{
                n.content++;
            }
        });
    });
}

function getCellNeighbours(cellId){
    var cellNeighbours = [];
    
    var leftNeighbour = cellId % FIELD_WIDTH !== 0;
    var topNeighbour = cellId > (FIELD_WIDTH-1);
    var rightNeighbour = (cellId+1) % FIELD_WIDTH !== 0;
    var bottomNeighbour = cellId < CELLNUMBER - FIELD_WIDTH;
    
    var leftTopNeighbour = leftNeighbour && topNeighbour;
    var rightTopNeighbour = rightNeighbour && topNeighbour;
    var leftBottomNeighbour = leftNeighbour && bottomNeighbour;
    var rightBottomNeighbour = rightNeighbour && bottomNeighbour;
    
    if (leftNeighbour){
        cellNeighbours.push(cells[cellId-1]);
    }
    if (rightNeighbour){
        cellNeighbours.push(cells[cellId+1]);
    }
    if (topNeighbour){
        cellNeighbours.push(cells[cellId - FIELD_WIDTH]);
    }
    if (bottomNeighbour){
        cellNeighbours.push(cells[cellId + FIELD_WIDTH]);
    }
    if (leftTopNeighbour){
        cellNeighbours.push(cells[cellId - FIELD_WIDTH - 1]);
    }
    if (rightTopNeighbour){
        cellNeighbours.push(cells[cellId - FIELD_WIDTH + 1]);
    }
    if (leftBottomNeighbour){
        cellNeighbours.push(cells[cellId + FIELD_WIDTH - 1]);
    }
    if (rightBottomNeighbour){
        cellNeighbours.push(cells[cellId + FIELD_WIDTH + 1]);
    }
    
    return cellNeighbours;
}

function openCell(event){
    
   
    var target = event.currentTarget;
    target.onclick = undefined;
    var cell = cells[target.id];
    
    cell.isClosed = false;
    
    switch(cell.contentType){
        case CONTENT_TYPES.BOMB: {
            showBombs();
            setTimeout(finishGame, 1);
            break;
        }
        case CONTENT_TYPES.NUMBER: {
            showNumber(cell);
            break;
        }
        case CONTENT_TYPES.EMPTY: {
            showEmptyCell(cell.id);
            break;
        }
    }
    
    if (isWin()){
        finishGame();
    }
}

function flagCell(event){
    var target = event.currentTarget;
    var cell = cells[target.id];
    
    var counterNumber = document.getElementById("counterNumber");
    
    if (!cell.isClosed){
        return;
    }
    
    if (cell.isFlaged === true){
        cell.isFlaged = false;
        target.className = "cells";
        counterNumber.innerHTML = ++bombsTargeted;
    } else {
        cell.isFlaged = true;
        target.className = "cells flagCells";
        counterNumber.innerHTML = --bombsTargeted;
    }
}

function showBombs(){
    cells.filter(function(c){
        return c.contentType === CONTENT_TYPES.BOMB;
    }).forEach(function(c){
        var cell = document.getElementById(c.id);
        cell.className = "cells openedCells bombCells";
    });
}

function showNumber(cell){
    cell.isClosed = false;
    
    var target = document.getElementById(cell.id);
    target.innerHTML = cell.content;
    
    var cellClass = "cells openedCells ";
    
    switch(cell.content){
        case 1: 
            cellClass = cellClass.concat("oneCell");
            break;
        
        case 2: 
            cellClass = cellClass.concat("twoCell");
            break;
            
        case 3: 
            cellClass = cellClass.concat("threeCell");
            break;
            
        case 4: 
            cellClass = cellClass.concat("fourCell");
            break;
            
        case 5: 
            cellClass = cellClass.concat("fiveCell");
            break;    
        
        case 6: 
            cellClass = cellClass.concat("sixCell");
            break;    
        
        case 7: 
            cellClass = cellClass.concat("sevenCell");
            break;    
        
        case 8: 
            cellClass = cellClass.concat("eightCell");
            break;
    }
    
    target.className = cellClass;
}

function showEmptyCell(cellId, processedEmptyCells){
    
    processedEmptyCells = processedEmptyCells || [];
    
    if(processedEmptyCells.indexOf(cellId) !== -1){
        return;
    }
    
    processedEmptyCells.push(cellId);
    
    var target = document.getElementById(cellId);
    target.className = "cells openedCells";
    
    cells[cellId].isClosed = false;
    
    var neighbours = getCellNeighbours(cellId);
    
    neighbours.forEach(function(n){
        if (n.contentType === CONTENT_TYPES.NUMBER){
            showNumber(n);
        } else if (n.contentType === CONTENT_TYPES.EMPTY){
            showEmptyCell(n.id, processedEmptyCells);
        }
    });
}

function isWin(){
    
    var otherCells = cells.filter(function(c){
        return c.contentType !== CONTENT_TYPES.BOMB;
    }).every(function(c){
        return !c.isClosed;
    });
    
    return otherCells;
}

function finishGame(){
    var container = document.getElementById("miner");
    var containerChildren = container.childNodes;
    [].forEach.call(containerChildren, function(c){
        c.onclick = undefined;                  //delete c.onclick is not working
    });
    
    var resultMessage = isWin() ? "You won!" : "You lose :(";
    
    if (confirm(resultMessage + " Do you want to start new game?")){
        reloadGame(); 
    };
}

function reloadGame(){
    var container = document.getElementById("miner");
    
    cells.forEach(function(c){
        var cell = document.getElementById(c.id);
        container.removeChild(cell);
    });
    
    initField();
}

function onNewBtnClick(event){
    reloadGame();
}