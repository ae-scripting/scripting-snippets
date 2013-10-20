//small script for making comp size divisible by 16
//headless

//Nik Ska, 2013
//CC-SA-BY

var activeComp = app.project.activeItem;  

if(activeComp != null && activeComp instanceof CompItem){
	var compSize = [activeComp.width, activeComp.height];
	
	app.beginUndoGroup("Resize to closest 16");
	
	activeComp.width = getClosest16(compSize[0]);
	activeComp.height = getClosest16(compSize[1]);

	app.endUndoGroup();

    }

var getClosest16 = function(a){
	if(a%16 == 0) return a;
	else if (a%16 < 4) return 16*Math.floor(a/16);
	else return 16*(Math.floor(a/16)+1);
}