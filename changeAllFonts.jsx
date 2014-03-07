var changeAllFontsScript={
	fontName:"Kankin"
};
changeAllFontsScript.go = function(){

FolderItem.prototype.getSelected = function(allItems)//boolean
{
	var arr=[];
	if (this.selected)
		allItems=true;
	for (var i=1;i<=this.numItems;i++)
		{
			var curItem=this.item(i);
			if (curItem instanceof FolderItem)
				{
					var inner=curItem.getSelected(allItems);
					arr=arr.concat(inner);
				}
			if ((allItems === true || curItem.selected) && curItem instanceof CompItem)
	            {
					arr.push(curItem);
				}
		}
	return arr;
}

Project.prototype.getSelectedItems = function()
{
	return this.rootFolder.getSelected(false);
}

TextLayer.prototype.changeFont=function(fontName)
{
	var prop=this.property("Source Text");
	if (prop.numKeys>0)
		for (var i=1;i<=prop.numKeys;i++)
		{
			var curTime=prop.keyTime(i);
			var textDocument=prop.valueAtTime(curTime,false);
			textDocument.font=fontName;
			prop.setValueAtTime(curTime,textDocument)
		}
	else
	{
		var textDocument=prop.value;
		textDocument.font=fontName;
		prop.setValue(textDocument);
	}
}

CompItem.prototype.changeFonts=function()
{
	for (var i=1;i<=this.numLayers;i++)	
		{
			var curLayer=this.layer(i);
			if (curLayer instanceof TextLayer)
				try
					{
						//alert("trying to change font of layer: "+curLayer.name);
						curLayer.changeFont(changeAllFontsScript.fontName);
					}
					catch(e)
					{
						return null;
					}
		}
	return 0;
}

	app.beginUndoGroup("Change All Fonts");

	var selItems=app.project.getSelectedItems();
	//alert("number of selected comps:"+selItems.length);

	for (var i=0;i<selItems.length;i++)
		{
			var func=selItems[i].changeFonts();//function returns null if caugth exeption
			if (func === null)
				{
					alert("Unknown font name");
					return 0;//end script
				}
		}
	
	alert("Done!");
	app.endUndoGroup();


}

changeAllFontsScript.go();