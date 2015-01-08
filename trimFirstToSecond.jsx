//Trim First Selected layer to the second one
//CC-BY-SA Nik Ska, 2013

var ns_Trim = {}

ns_Trim.go = function(){
	var activeComp = app.project.activeItem; //active item
	if(activeComp && activeComp instanceof CompItem){ //if it's a comp
		var sel = activeComp.selectedLayers; //selected layers
		app.beginUndoGroup("Trim"); //Undo
		if(sel.length>1){ //if more than 1 are selected
			//sel[0].startTime = sel[1].startTime; //trim
			sel[0].inPoint = sel[1].inPoint;
			sel[0].outPoint = sel[1].outPoint;
			var prev = sel[1]; //remembering previous layer
		}
		else if(prev){
			//with layer remembered
			//trim all firther selected
			sel[0].startTime = prev.startTime;
			sel[0].inPoint = prev.inPoint;
			sel[0].outPoint = prev.outPoint;
		}

		app.endUndoGroup(); //closing Undo
	}
}
ns_Trim.go()