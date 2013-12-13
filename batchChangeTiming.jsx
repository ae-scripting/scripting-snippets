//Script used for batch change timing of selected compositions
//or actve comp with all layers
//It basically adjusts outPoints of all layers and precomps

//0.1 - initial release
//0.2 - code cleanup, true recursive function
//0.3 - minor update
//0.31 - fixed improper behavior with shorter than comp layers

//CC-BY, Nik Ska, 2013


var chTiming = this;
chTiming.version = 0.31;
chTiming.scriptTitle = "Batch Timing Changer";

chTiming.run = function(){
    this.buildGUI(this);
}

chTiming.buildGUI = function(thisObj){
	thisObj.w = (thisObj instanceof Panel) ? thisObj : new Window("palette", thisObj.scriptTitle, undefined, {resizeable:true});
	thisObj.w.alignChildren = ['left', 'top']
	var g = thisObj.w.add("group{orientation:'row', alignChildren: ['left', 'top']}");
	var timeText = g.add("editText", undefined, "0");
	timeText.size = [40, 25];
	var modeselect = g.add("dropdownlist", undefined, ["s", "fr"]);
	modeselect.selection = 0;

	timeText.onEnterKey = function(){
		thisObj.changeTiming(Number(timeText.text), modeselect.selection.index);
	}

	if (thisObj.w instanceof Window){
	    thisObj.w.center();
	    thisObj.w.show();
	}
	else thisObj.w.layout.layout(true);
}

chTiming.changeTiming = function(_time, _sel){
	function loopthrough(compToChange, _newDuration){
    	//first - loop through compositions
    	for(var i = 0; i<compToChange.length; i++){
			//now loop through comp's layers
			for(var k = 1; k<=compToChange[i].layers.length; k++){
				var layerToChange = compToChange[i].layers[k];
				if(_newDuration>layerToChange.inPoint && layerToChange.outPoint>=compToChange[i].duration){
					layerToChange.outPoint = _newDuration;
				
					if(layerToChange.source instanceof CompItem){
						//if the layer we stumble upon is a comp - go deeper
						loopthrough([layerToChange.source], _newDuration-layerToChange.inPoint);
						layerToChange.outPoint = _newDuration;
					}
				}
			}
			compToChange[i].duration = _newDuration;
		}
    }
    
	var selComps = app.project.selection;

	if(app.project.activeItem && app.project.activeItem instanceof CompItem){
	//if we are in a comp
		var comps = [app.project.activeItem];
	}
	else if(selComps.length>0){
		var comps = selComps;
	}

	if(_sel == 1) _time*=selComps[0].frameDuration //frames

	app.beginUndoGroup("Change timing");
	loopthrough(comps, _time);
	app.endUndoGroup();
}

chTiming.run()