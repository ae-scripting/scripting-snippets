//Snippet for new trimmed null creation
//creates a null trimmed to the highest selected layer
//inherits its color
//CC-BY-SA Nik Ska, 2013

var newNull = {}

newNull.go = function(){
	var activeComp = app.project.activeItem; //active item
	if(activeComp && activeComp instanceof CompItem){ //if it's a comp 
		var sel = activeComp.selectedLayers; //selected layers
		app.beginUndoGroup("Create smart null"); //Undo
		var nullLayer = activeComp.layers.addNull(); //adding Null
		if(sel){ //if anything is selected
			sel.sort(function(a,b){ //sort by index
				return a.index - b.index;
			});
			nullLayer.moveBefore(sel[0]); //placing before the 1st
			nullLayer.startTime = sel[0].startTime; //trim
			nullLayer.inPoint = sel[0].inPoint;
			nullLayer.outPoint = sel[0].outPoint;
			nullLayer.label = sel[0].label; //inherit color
		}
		app.endUndoGroup(); //closing undo
	}
}
newNull.go()