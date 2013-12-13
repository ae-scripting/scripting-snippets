//Experiment to make nice and clean precomps
//Works for AE prior to CC, where "adjust precomp to layers"
//is introduced

//Just precomp your layer, then run this script and it will recursively 
//adjust its ins and outs to its comtents.

//CC-BY-SA Nik Ska, 2013

var precompFixer = {}

precompFixer.go = function(){
	function getTimes(_sel){
		var end = 0; //look for the last outpoint
		for(var e = 1; e <= _sel.length; e++){
			if(_sel[e].outPoint>end) end = _sel[e].outPoint;
		}
		var begin = end; //look for the first inpoint
		for(var b = 1; b <= _sel.length; b++){
			if(_sel[b].inPoint<begin) begin = _sel[b].inPoint;
		}
		return([begin, end])
	}

	var activeComp = app.project.activeItem; //active item
	if(activeComp && activeComp instanceof CompItem){ //if it's a comp 
		var sel = activeComp.selectedLayers; //selected layers
		app.beginUndoGroup("Nice Precomp"); //Undo
		if(sel.length == 1 && sel[0].source instanceof CompItem){ //if we have comp selected
			var precomp = sel[0].source; //use it
			var timings = getTimes(precomp.layers); //calculate it's layers' ins and outs
			precomp.duration = timings[1]-timings[0]; //new duration
			precomp.displayStartTime = timings[0]; //shift Display Start Time
			sel[0].startTime+=timings[0]; //shift precomp
			for(var l = 1 ; l <= precomp.layers.length ; l++){
				precomp.layers[l].startTime -= timings[0]; //shift precomp layers
			}
		}
		app.endUndoGroup(); //close Undo
	}
}
precompFixer.go()