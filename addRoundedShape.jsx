/*
Just adds a blank shape object with rounded Line Cap and Line Join
Exclusively for Al Medwedsky

CC-BY, Nik Ska, 2014
*/

var addRoundedShape = function(){
    var activeComp = app.project.activeItem;
    if(activeComp && activeComp instanceof CompItem){
        var sel = activeComp.selectedLayers; //selected layers

        app.beginUndoGroup("Add a rounded shape");
        var newShape = activeComp.layers.addShape();
        var shapeGroup = newShape.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
        
        shapeGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Group");
        var shapeFill = shapeGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill");
        shapeFill.enabled = false;

        var shapeStroke = shapeGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Stroke");
        shapeStroke.property("ADBE Vector Stroke Line Cap").setValue(2);
        shapeStroke.property("ADBE Vector Stroke Line Join").setValue(2);

        if(sel){ //if anything is selected
            sel.sort(function(a,b){ //sort by index
                return a.index - b.index;
            });
            newShape.moveBefore(sel[0]); //placing before the 1st
        };

        app.endUndoGroup();
    }
}

addRoundedShape();