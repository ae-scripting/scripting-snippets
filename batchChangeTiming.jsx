//script used for batch change timing of selected compositions
//or actve comp with all layers
//useful when working with 3d passes

//0.1 - initial release
//0.2 - code cleanup, true recursive function

//CC-BY, Nik Ska, 2013


var chTiming = this;

chTiming.run = function(){
    this.buildGUI(this);
    }

chTiming.buildGUI = function(thisObj){
	thisObj.w = (thisObj instanceof Panel) ? thisObj : new Window("palette", thisObj.scriptTitle, undefined, {resizeable:true});
	thisObj.w.alignChildren = ['left', 'top']
	thisObj.w.add("staticText", undefined, "Batch Timing Changer 0.1");
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
    function loopthrough(compToChange){
    	//first - loop through compositions
    	for(var i = 0; i<compToChange.length; i++){
			//if we work with frames - update time value
			compToChange[i].duration = _time;

			//now loop through comp's layers
			for(var k = 1; k<=compToChange[i].layers.length; k++){
				var layerToChange = compToChange[i].layers[k];

				layerToChange.outPoint = compToChange[i].duration;

				if(layerToChange.source instanceof CompItem){
					//if the layer we stumble upon is a comp - go deeper
					loopthrough([layerToChange.source]);
					layerToChange.outPoint = compToChange[i].duration;
				}
			}
		}
    }
    
	var selComps = app.project.selection;


	if(app.project.activeItem){
		$.writeln(app.project.activeItem.selected)
		if(app.project.activeItem.selected){
			_time = app.project.activeItem.selected[0].duration
		}
		var comps = [app.project.activeItem];
	}
	else if(selComps.length>0){
		var comps = selComps;
	}

	if(_sel == 1) _time*=selComps[0].frameDuration //frames

	app.beginUndoGroup("Change timing");
	loopthrough(comps);
	app.endUndoGroup();
}

chTiming.run()