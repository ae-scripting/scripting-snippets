/*
Shuffles all selected layers. If none layers selected. shuffles all layers in comp

CC-BY, Alex Kravchenko, 2016
*/

var shuffleLayers = this;

shuffleLayers.shuffle = function(arr) 
	{
		for (var i = arr.length; i; i--) 
			{
				var j = Math.floor(Math.random() * i);
				var x = arr[i - 1];
				arr[i - 1] = arr[j];
				arr[j] = x;
			}
	}

shuffleLayers.getActiveComp = function()
	{
		var myComp = app.project.activeItem;
		if(!myComp)
			return null;
		if(!(myComp instanceof CompItem))
			return null;
		return myComp;
	}

shuffleLayers.start = function()
	{
		app.beginUndoGroup("Shuffle Layers");
		var myComp = shuffleLayers.getActiveComp();
		if(!myComp)
			{
				alert("Please open composition");
				return 0;
			}

		//get all selected layers
		var selLayers = [];
		if(myComp.selectedLayers.length == 0)
			for(var i=1; i<=myComp.numLayers;i++)
				selLayers.push(myComp.layer(i));
		else
			for(var i=0; i<myComp.selectedLayers.length;i++)
				selLayers.push(myComp.selectedLayers[i]);

		//order selected layers by index
		var flag = true;
		while(flag)
			{
				flag = false;
				for(var i=0;i<selLayers.length-1;i++)
					if(selLayers[i].index > selLayers[i+1].index)
						{
							flag = true;
							var x = selLayers[i];
							selLayers[i] = selLayers[i+1];
							selLayers[i+1] = x;
						}
			}

		//save original indexes, to put layers back there later
		var oldIndexes = [];
		for(var i=0;i<selLayers.length;i++)
			oldIndexes.push(selLayers[i].index);
		
		//shuflle selected layers 
		shuffleLayers.shuffle(selLayers);
		
		//$.bp();

		//put all layers to the bottom of the comp, to avoid interference
		for(var i=0;i<selLayers.length;i++)
			{
				var curLayer = selLayers[i];
				var locked = curLayer.locked;
				curLayer.locked = false;
				curLayer.moveToEnd();
				curLayer.locked = locked;
			}

		//put shuffled layers back to old indexes
		for(var i=0;i<selLayers.length;i++)
			{
				var curLayer = selLayers[i];
				var newIndex = oldIndexes[i];
				var locked = curLayer.locked;

				curLayer.locked = false;

				if(newIndex == 1)
					{
						//$.writeln("Gonna move " + curLayer.index+" to the top");
						curLayer.moveToBeginning();
					}
				else
					{
						//$.writeln("Gonna move " + curLayer.index+" after " + myComp.layer(newIndex-1).index);
						curLayer.moveAfter(myComp.layer(newIndex-1));
					}
				curLayer.locked = locked;
			}

		app.endUndoGroup();
	}

shuffleLayers.start();