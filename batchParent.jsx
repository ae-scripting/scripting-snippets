//script used for batch change parenting layers
//1. select the batch you want to parent
//2. select the batch you want to parent it to

//order matters

//0.1 - initial release

//CC-BY-SA, Nik Ska, 2013


var nsBatchParent = this;
this.version = 0.1;
this.scriptTitle = "Batch Parent";

nsBatchParent.run = function(){
    this.buildGUI(this);
    }

nsBatchParent.thisBatch = [];
nsBatchParent.thatBatch = [];

nsBatchParent.buildGUI = function(thisObj){
	thisObj.w = (thisObj instanceof Panel) ? thisObj : new Window("palette", thisObj.scriptTitle, undefined, {resizeable:true});
	thisObj.w.alignChildren = ['left', 'top']
	
	var l1 = thisObj.w.add("group{orientation:'row', alignChildren: ['left', 'top']}");
	l1.add("staticText", undefined, "Parent");
	l1.margins = [0,0,0,0];
	var thisBttn = l1.add("button", undefined, "this");
	thisBttn.size = [40, 20];

	var l2 = thisObj.w.add("group{orientation:'row', alignChildren: ['left', 'top']}");
	var toTxt = l2.add("staticText", undefined, "     to");
	toTxt.size = [33,20];
	l2.margins = [0,0,0,0];
	var thatBttn = l2.add("button", undefined, "that");
	thatBttn.size = [40, 20];

	thisBttn.onClick = function(){
		thisObj.getThis(thisObj);
	}

	thatBttn.onClick = function(){
		thisObj.getThat(thisObj);
	}

	if (thisObj.w instanceof Window){
	    thisObj.w.center();
	    thisObj.w.show();
	}
	else thisObj.w.layout.layout(true);
}

nsBatchParent.getThis = function(thisObj){
	var activeComp = app.project.activeItem;
	if(activeComp && activeComp instanceof CompItem){
		if(activeComp.selectedLayers.length){
			thisObj.thisBatch = activeComp.selectedLayers;
		}
		else alert("Select at least one layer")
	}
}

nsBatchParent.getThat = function(thisObj){
	var activeComp = app.project.activeItem;
	if(activeComp && activeComp instanceof CompItem){
		if(activeComp.selectedLayers && activeComp.selectedLayers.length === thisObj.thisBatch.length){
			thisObj.thatBatch = activeComp.selectedLayers;
			thisObj.parentShit(thisObj);
		}
		else alert("Select the same amount of layers: " + thisObj.thatBatch.length)
	}
}

nsBatchParent.parentShit = function(thisObj){
	for(var i = 0; i < thisObj.thisBatch.length; i++){
		thisObj.thisBatch[i].parent = thisObj.thatBatch[i];
	}

}

nsBatchParent.run();