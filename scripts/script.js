"use strict";

var CELLNUMBER = 81;
var BOMBNUMBER = 10;
var cells;

function init(){
    
    cells = [];
    
    for(var i = 0; i < CELLNUMBER; i++) {
        cells[i] = {
            isClosed: true,
            isFlaged: false,
            content: null,      //bomb, number, empty
            emptySpace: null
        };
    }
}