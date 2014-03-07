PropertyGroup.prototype.removeStrokes=function(){
	var strokeName="ADBE Vector Graphic - Stroke";

	if (this.property(strokeName)!=null)//если есть Stroke
		this.property(strokeName).remove();

	for(var i=1;i<=this.numProperties;i++)
		if(this.property(i) instanceof PropertyGroup)
			this.property(i).removeStrokes();
}


function removeStrokes(){
	
	var myComp=app.project.activeItem;
	if (!(myComp!== null && myComp instanceof CompItem))
		return 0;
	var selLayers=myComp.selectedLayers;
		for(var i=0;i<selLayers.length;i++)
			{
				var curLayer=selLayers[i];
				if (curLayer instanceof ShapeLayer)
					curLayer.property("ADBE Root Vectors Group").removeStrokes();
			}

}

app.beginUndoGroup("Remove Strokes");
removeStrokes();
app.endUndoGroup();