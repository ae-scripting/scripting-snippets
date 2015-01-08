//This script is an example of parsing csv file into AE comps

function findCompByName(_name){
	for(var i=1;i<=app.project.numItems;i++){
		if(app.project.item(i).name==_name && app.project.item(i) instanceof CompItem) return app.project.item(i);
	}
	return null
}

function findEffectByName(_name, _layer){
	//looks for an effect with given name inside given layer
	var eff = _layer.property("ADBE Effect Parade");
	for(var e = 1; e<= eff.numProperties; e++){
		if(eff.property(e).name == _name) return eff.property(e);
	}
	return null;
}

function getFolder(_name){
	//function for gettin a specific folder
	var bFolder;
	for(var i=1;i<=app.project.numItems;i++){
		if(app.project.item(i).name==_name && app.project.item(i) instanceof FolderItem) bFolder = app.project.item(i);
	}

	//if ther is no such folder, add it
	if(!bFolder) bFolder = app.project.items.addFolder(_name);
	return bFolder
}

var textFile = File.openDialog ("Choose a csv file","*.csv");

if (textFile != null) {
    var textLines = [];
    textFile.open("r"); 
}

while (!textFile.eof){
    //reading file into lines
    textLines.push(textFile.readln()); 
}

var template = findCompByName("info_template"); //reference comp
var bFolder = getFolder("broadcast");
app.beginUndoGroup("tst");
for(var t = 1; t<textLines.length; t++){
	var newComp = template.duplicate();
	newComp.name = "info_"+String(t);
	newComp.parentFolder = bFolder;

	var infoName = newComp.layer("name").property("ADBE Text Properties").property("ADBE Text Document");
	var infoRegion = newComp.layer("region").property("ADBE Text Properties").property("ADBE Text Document");
	var infoNumber = findEffectByName("amount",  newComp.layer("number").property("ADBE Slider Control-0001");

	var infoLine = textLines[t].split(',');
	infoName.setValue(infoLine[0]);
	infoRegion.setValue(infoLine[1]);
	infoNumber.setValueAtTime(infoNumber.keyTime(2), Number(infoLine[2])/100000);
}

app.endUndoGroup();