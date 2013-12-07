//Script used for batch change timing of selected compositions
//or actve comp with all layers
//It basically adjusts outPoints of all layers and precomps

//0.1 - initial release
//0.2 - code cleanup, true recursive function
//0.3 - minor update

//CC-BY, Nik Ska, 2013


var chTiming = this;
chTiming.version = 0.3;
chTiming.scriptTitle = "Batch Timing Changer";

chTiming.run = function(){
    this.buildGUI(this);
}

chTiming.buildGUI = function(thisObj){
	thisObj.w = (thisObj instanceof Panel) ? thisObj : new Window("palette", thisObj.scriptTitle, undefined, {resizeable:true});
	thisObj.w.alignChildren = ['left', 'top']
	thisObj.w.add("staticText", undefined, "Batch Timing Changer "+thisObj.version);
	var g = thisObj.w.add("group{orientation:'row', alignChildren: ['left', 'top']}");
	var timeText = g.add("editText", undefined, "0");
	timeText.size = [40, 20];
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
			//if we work with frames - update time value
			compToChange[i].duration = _newDuration;
			//now loop through comp's layers
			for(var k = 1; k<=compToChange[i].layers.length; k++){
				var layerToChange = compToChange[i].layers[k];

				if(compToChange[i].duration>layerToChange.inPoint){
					layerToChange.outPoint = compToChange[i].duration;
				}

				if(layerToChange.source instanceof CompItem){
					//if the layer we stumble upon is a comp - go deeper
					if(compToChange[i].duration>layerToChange.inPoint){
						loopthrough([layerToChange.source], _newDuration-layerToChange.inPoint);
						layerToChange.outPoint = _newDuration;
					}
				}
			}
		}
    }
    
	var selComps = app.project.selection;


	if(app.project.activeItem){ //if we are in a comp
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