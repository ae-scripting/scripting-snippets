function findCompByName(_name){
	for(var i = 1; i <= app.project.numItems; i++){
		if(app.project.item(i).name == _name && app.project.item(i) instanceof CompItem){
			return app.project.item(i);
		}
	}
	return null;
}

function findLayerByName(_name, _comp){
	for(var l = 1; l <= _comp.layers.length; l++){
		if(_comp.layers[l].name == _name) return _comp.layers[l];
	}
	return null;
}

function findEffectByName(_name, _layer){
	//looks for an effect with given name inside given layer
	var eff = _layer.property("ADBE Effect Parade");
	for(var e = 1; e <= eff.numProperties; e++){
		if(eff.property(e).name == _name) return eff.property(e);
	}
	return null;
}


function getFolder(_name){
	//function for gettin a specific folder
	var bFolder;

	for(var i=1;i<=app.project.numItems;i++){
		if(app.project.item(i).name == _name && app.project.item(i) instanceof FolderItem) bFolder = app.project.item(i);
	}

	//if ther is no such folder, add it
	if(!bFolder) bFolder = app.project.items.addFolder(_name);
	return bFolder
}


//open file
var textFile = File.openDialog ("Choose a csv file","*.csv");

if (textFile != null) {
	//initialize array
    var textLines = [];
    textFile.open("r"); 


	while(!textFile.eof){
	    //reading file into lines
	    textLines.push(textFile.readln());
	}

	app.beginUndoGroup("Reading csv");

	//making or getting folder
	targetFolder = getFolder("broadcast");
	var template = findCompByName("info_template");

	for(var i = 1; i<textLines.length; i++){

		var line = textLines[i].split(",");
		
		var newComp = template.duplicate();
		newComp.name = "infoline_" + String(i);
		newComp.parentFolder = targetFolder;

		//accessing variables
		var nameText = findLayerByName("name", newComp).property("ADBE Text Properties").property("ADBE Text Document");
		var regionText = findLayerByName("region", newComp).property("ADBE Text Properties").property("ADBE Text Document");
		var numberValue = findEffectByName("amount", findLayerByName("number", newComp)).property("ADBE Slider Control-0001");

		//setting variables
		nameText.setValue(line[0]);
		regionText.setValue(line[1]);
		numberValue.setValueAtKey(2, Number(line[2])/100000);
	}
	app.endUndoGroup();
}