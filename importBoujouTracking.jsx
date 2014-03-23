//Import Boujou 2d tracks to AE
//CC-BY Nik Ska, 2014

var parseBoujou = this;

parseBoujou.go = function(){

	function createNull(comp, _name){
		var newTrackNull = comp.layers.addNull();
    	newTrackNull.name = "Boujou Null_" + _name;
    	newTrackNull.threeDLayer = true;
    	newTrackNull.label = 10;
    	return newTrackNull;
	}

	var textFile = File.openDialog ("Choose a tracking data file","*.txt");

	if (textFile != null) {
	    var textLines = [];
	    textFile.open("r"); 

		while (!textFile.eof){
		    //reading file into lines
		    textLines.push(textFile.readln()); 
		}

		var activeComp = app.project.activeItem;
		if(activeComp && activeComp instanceof CompItem){
			app.beginUndoGroup("Parse Boujou");

			//regex to match X/Y and null name
		    var XYmatch = /(\d+([\.]\d+)?)/g;
		    var nameMatch = /auto_(\d+)/;

		    for(var t = 1; t<textLines.length; t++){
		    	if(t>5){
		    		var parsed = textLines[t].match(XYmatch);
		    		var nullNum = textLines[t].match(nameMatch)[1];
		    		//check for existing null
		    		var curNull = activeComp.layer("Boujou Null_"+nullNum);
		    		//create one if there is no null
		    		if(!curNull) curNull = createNull(activeComp, nullNum);

		    		if(parsed){
		    			// $.writeln(textLines[t].match(XYmatch))
		    			// $.writeln(Number(parsed[2]), ", ", Number(parsed[3]));;

		    			curNull.property("ADBE Transform Group").property("ADBE Position").setValueAtTime(Number(parsed[1]-1)*activeComp.frameDuration, [Number(parsed[2]), Number(parsed[3]),0]);
		    		}
		    	}
		    }


		}

		app.endUndoGroup();
	}
}

parseBoujou.go();