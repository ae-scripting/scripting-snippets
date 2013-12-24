// BakeRepeat - tool similar to Cinema 4D's "curret state object"
// Creates copies of shape populated by Repeater modifier
var repeaterInstances = [{}]; //array for repeater(s)

function doit(){
	var activeItem = app.project.activeItem;
	if(activeItem != null && activeItem instanceof CompItem){
		app.beginUndoGroup("Bake repeater");
		var sel = activeItem.selectedLayers;
	    var selProp = activeItem.selectedProperties;
	    if(selProp.length == 1 && selProp[0].matchName == "ADBE Vector Filter - Repeater"){
	    	repeaterInstances[0].repeater = selProp[0];
	        getRepeaterAttr(selProp[0], repeaterInstances[0]);
	        }
	    var _obj = app.project.item(1).layer("tst_bake").property("Contents").property("Rectangle 1");
	    makeCopies(_obj, repeaterInstances[0]);
	    app.endUndoGroup();
	}
}

function makeCopies(_obj, _repeater){
	var numCopies = Number(_repeater["ADBE Vector Repeater Copies"]);
	_repeater.repeater.enabled = false;
	
    var tmp = _obj;
    var offset = Number(_repeater["ADBE Vector Repeater Offset"]);
	for (var i = offset; i < numCopies+offset; i++) {
		setAttrFromRepeater([tmp], _repeater, i);
		tmp = tmp.duplicate();
        
	};
}

function setAttrFromRepeater(_shape, _repeater, _num){
	//function to set shape properties based on repeater object
	//_shape is a set of shapes to appy transform to
	//_repeater is a repeater instance
	//_num is the copy number

	/* Matchnames`
	ADBE Vector Repeater Copies: 3
	ADBE Vector Repeater Offset: 1
	ADBE Vector Repeater Order: 1
	ADBE Vector Repeater Anchor: 0,27
	ADBE Vector Repeater Position: 100,0
	ADBE Vector Repeater Scale: 77,77
	ADBE Vector Repeater Rotation: 19
	ADBE Vector Repeater Opacity 1: 61
	ADBE Vector Repeater Opacity 2: 100
	*/ 

	for(var k = 0 ; k < _shape.length ; k++){
		var tr = _shape[k].property("ADBE Vector Transform Group");
		var offset = Number(_repeater["ADBE Vector Repeater Offset"]);
		if(_num == offset){
			//moving first copy
			tr.property("ADBE Vector Anchor").setValue(tr.property("ADBE Vector Anchor").value + _repeater["ADBE Vector Repeater Anchor"] - tr.property("ADBE Vector Position").value);
			tr.property("ADBE Vector Position").setValue(_repeater["ADBE Vector Repeater Anchor"]);
		}
		else{
			//all the others
			tr.property("ADBE Vector Position").setValue(tr.property("ADBE Vector Position").value +_repeater["ADBE Vector Repeater Position"]);
			tr.property("ADBE Vector Scale").setValue([tr.property("ADBE Vector Scale").value[0]*(_repeater["ADBE Vector Repeater Scale"][0]/100), tr.property("ADBE Vector Scale").value[1]*(_repeater["ADBE Vector Repeater Scale"][1]/100)]);
			tr.property("ADBE Vector Rotation").setValue(tr.property("ADBE Vector Rotation").value+_repeater["ADBE Vector Repeater Rotation"]);
		}
		tr.property("ADBE Vector Opacity").setValue(_repeater["ADBE Vector Opacity 1"] + (_num-offset)*(_repeater["ADBE Vector Opacity 2"]-_repeater["ADBE Vector Opacity 1"])/_repeater["ADBE Vector Repeater Copies"]);
		}
    }

function setExpression(){
	//placeholder for the expression setter

}

function bakeExpression(){
	//placeholder for expressions baker
}
   

function getRepeaterAttr(_property, repInstance){
	//recursive function to collect all repeater settings
	//first - check if we walk over a property group
	if(_property.propertyType == PropertyType.NAMED_GROUP){
		var tmp = _property.numProperties;
		for(var i = 1; i <= tmp; i++){
			if(_property.property(i).propertyType == PropertyType.NAMED_GROUP){
				getRepeaterAttr(_property.property(i), repInstance)
			}
			else{
				//set repeater instance's values
                repInstance[_property.property(i).matchName] = _property.property(i).value;
                $.writeln(_property.property(i).matchName + ' ' + String(_property.property(i).value));
			}
		}
	}
	else return null
}



doit();