//Snippet for new trimmed null creation
//creates a null trimmed to the highest selected layer
//inherits its color
//CC-BY-SA Nik Ska, 2013

var newNull = {}

newNull.go = function(){
	var activeComp = app.project.activeItem;

	if(activeComp && activeComp instanceof CompItem){ 
		var sel = activeComp.selectedLayers;
		if(sel){
		app.beginUndoGroup("Create smart null"); 
		sel.sort(function(a,b){
			return a.index - b.index;
		});
		var nullLayer = activeComp.layers.addNull();
		nullLayer.moveBefore(sel[0]);
		nullLayer.startTime = sel[0].startTime;
		nullLayer.outPoint = sel[0].outPoint;
		nullLayer.label = sel[0].label;
		
		app.endUndoGroup();
		}

	}
}

newNull.go()