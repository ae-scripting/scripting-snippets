//Script draws dynamic rectangle shape around text or any object
//Only for AE 13.2 and higher
//Alex Kravchenko, 2015

CompItem.prototype.dd_dynamicBbox_createBbox = function(_layer)
{
	bboxProps = {"fill":{"color":[0.5,0.5,0.5,1]},
				"stroke":{"width":20,"color":[0.3,0.3,0.3,1]},
				"addSpace":50};

	//shape match names:
	var contentsName = "ADBE Root Vectors Group";
	var vectorGroupName = "ADBE Vector Group";//a shape group
		var rectPathName = "ADBE Vector Shape - Rect";//rectangle group
			var rectPathSizeName = "ADBE Vector Rect Size";//rectangle size
	var strokeGroupName = "ADBE Vector Graphic - Stroke";//stroke
		var strokeWidthName = "ADBE Vector Stroke Width";//stroke width
		var strokeColorName = "ADBE Vector Stroke Color";//stroke color
	var fillGroupName = "ADBE Vector Graphic - Fill";//fill
		var fillColorName = "ADBE Vector Fill Color";////fill color

	//effect match names:
	var effectsName = "ADBE Effect Parade";
	var layerControlName = "ADBE Layer Control";
	var sliderControlName = "ADBE Slider Control";
	var cbControlName = "ADBE Checkbox Control";

	//expressions:
	var shapeSizeExpression = "textLayer = effect(\"target layer\")(\"Layer\");\nvar strokes = effect(\"accept strokes\")(\"Checkbox\");\nvar add = effect(\"add space\")(\"Slider\");\nbbox = textLayer.sourceRectAtTime(time,strokes);//bounding box вокруг текста\n[bbox.width*textLayer.scale[0]/100,bbox.height*textLayer.scale[1]/100]+[add,add]//ширина bbox'а плюс немного отступа по краям";
	var textSizeExpression = "textLayer = effect(\"target layer\")(\"Layer\");\nvar add = effect(\"add space\")(\"Slider\");\nbbox = textLayer.sourceRectAtTime(time,false);//bounding box вокруг текста\n[bbox.width*textLayer.scale[0]/100,bbox.height*textLayer.scale[1]/100]+[add,add]//ширина bbox'а плюс немного отступа по краям";
	
	var shapePosExpression = "textLayer = effect(\"target layer\")(\"Layer\");\nvar strokes = effect(\"accept strokes\")(\"Checkbox\");\nbbox = textLayer.sourceRectAtTime(time,strokes);\ntextLayer.position-textLayer.anchorPoint+\n	[bbox.left*textLayer.scale[0]/100,bbox.top*textLayer.scale[1]/100]+\n	[bbox.width*textLayer.scale[0]/100,bbox.height*textLayer.scale[1]/100]/2;";
	var textPosExpression = "textLayer = effect(\"target layer\")(\"Layer\");\nbbox = textLayer.sourceRectAtTime(time,false);\ntextLayer.position-textLayer.anchorPoint+\n	[bbox.left*textLayer.scale[0]/100,bbox.top*textLayer.scale[1]/100]+\n	[bbox.width*textLayer.scale[0]/100,bbox.height*textLayer.scale[1]/100]/2;";

	//creating shape layer
	var newShape = this.layers.addShape();
	newShape.name = _layer.name+"_bbox";
	newShape.moveAfter(_layer);
	
	//creating all controls
	var layerControl = newShape.property(effectsName).addProperty(layerControlName);
		layerControl.name = "Target Layer";
		layerControl.property(layerControlName+"-0001").setValue(_layer.index);
	var sliderControl = newShape.property(effectsName).addProperty(sliderControlName);
		sliderControl.name = "Padding";
		sliderControl.property(sliderControlName+"-0001").setValue(bboxProps.addSpace);
	if(_layer instanceof ShapeLayer)
		{
			var checkboxControl = newShape.property(effectsName).addProperty(cbControlName);
			checkboxControl.name = "Accept Strokes";
			checkboxControl.property(cbControlName+"-0001").setValue(true);
		}

	if(_layer instanceof ShapeLayer)
		newShape.position.expression = shapePosExpression;
	else
		newShape.position.expression = textPosExpression;
	var rectGroup = newShape.property(contentsName).addProperty(rectPathName);
	var rectSize = rectGroup.property(rectPathSizeName);
		if(_layer instanceof ShapeLayer)
			rectSize.expression = shapeSizeExpression;
		else
			rectSize.expression = textSizeExpression;
	var fillGroup = newShape.property(contentsName).addProperty(fillGroupName);
		fillGroup.property(fillColorName).setValue(bboxProps.fill.color);
	var strokeGroup = newShape.property(contentsName).addProperty(strokeGroupName);
		strokeGroup.property(strokeColorName).setValue(bboxProps.stroke.color);
		strokeGroup.property(strokeWidthName).setValue(bboxProps.stroke.width);
}


function dd_dynamicBbox()
{
	vers = parseFloat(app.version);
	if(vers<13.2)
		{
			alert("Update to After Effects CC2014 or later to use this script");
			return 0;
		}
	var myComp = app.project.activeItem;
	if(!myComp || !(myComp instanceof CompItem) || myComp.selectedLayers.length==0)
		{
			alert("Choose at least one layer");
			return 0;
		}
	
	var arr = []//layers array (only text and/or shape layers)
	for(var i=0;i<myComp.selectedLayers.length;i++)
		if(myComp.selectedLayers[i] instanceof TextLayer || myComp.selectedLayers[i] instanceof ShapeLayer)
			arr.push(myComp.selectedLayers[i]);
	if(arr.length == 0)
		{
			alert("Select Shape or Text layer");
			return 0;
		}
	for(var i=0;i<arr.length;i++)
		myComp.dd_dynamicBbox_createBbox(arr[i]);

}

app.beginUndoGroup("Dynamic Bbox");
dd_dynamicBbox();
app.endUndoGroup();