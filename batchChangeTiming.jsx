//script used for batch change timing of selected compositions
//or actve comp with all layers
//useful when working with 3d passes
//Nik Ska, 2013


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

	var g2 = thisObj.w.add("group{orientation:'row', alignChildren: ['left', 'top']}");
	var recChck = g2.add("checkbox", undefined, "Recursive");

	timeText.onEnterKey = function(){
		thisObj.changeTiming(Number(timeText.text), modeselect.selection.index, recChck.value);
	}

	if (thisObj.w instanceof Window){
    thisObj.w.center();
    thisObj.w.show();
  }
  else thisObj.w.layout.layout(true);
}

chTiming.changeTiming = function(_time, _sel, recursive){
    function loopthrough(){
      for(var i = 0; i<vids.length; i++){
				if(_sel == 1){_time*=vids[i].frameDuration} //frames
				vids[i].duration = _time;
				for(var k = 1; k<=vids[i].layers.length; k++){
					vids[i].layers[k].outPoint = vids[i].duration;
				}
			}
    }
	var sel_vids = app.project.selection;
		if(sel_vids.length>0){
			var vids = sel_vids;
      loopthrough()
		}
		else if(app.project.activeItem){
			var vids = [app.project.activeItem];
      loopthrough()
		}

		
}

chTiming.run()