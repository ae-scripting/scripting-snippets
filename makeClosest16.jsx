//small script for making comp size divisible by 16
//simple GUI

//Nik Ska, 2013
//CC-SA-BY

var make16 = this;

make16.buildGUI = function(thisObj){
	thisObj.w = (thisObj instanceof Panel) ? thisObj : new Window("palette", "16", undefined, {resizeable:true});
	thisObj.w.alignChildren = ['left', 'top']
	//thisObj.w.size = [50,50];
	thisObj.w.minimumSize = "width: 50, height: 50";
	//thisObj.w.maximumSize = "width:50, height: 50";

	var makeit = thisObj.w.add("button", undefined, "16!");
	makeit.size = [30,30];

	makeit.onClick = function(){
		thisObj.run();
	}

	if (thisObj.w instanceof Window){
		thisObj.w.center();
		thisObj.w.show();
	}
	else thisObj.w.layout.layout(true);
}

make16.run = function(){
	var activeComp = app.project.activeItem;  

	var getClosest16 = function(a){
		if(a%16 == 0) return a;
		else return 16*(Math.floor(a/16)+1);
	}

	if(activeComp != null && activeComp instanceof CompItem){
		var compSize = [activeComp.width, activeComp.height];
		app.beginUndoGroup("Resize to closest 16");
		activeComp.width = getClosest16(compSize[0]);
		activeComp.height = getClosest16(compSize[1]);
		app.endUndoGroup();

	    }

	
}

make16.buildGUI(make16)