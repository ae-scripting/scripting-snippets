//debug helper - creates a small panel with text layer linked to all selected properties
//now works in a comand line mode

var activeItem = app.project.activeItem;

var activeItem = app.project.activeItem;
if (activeItem != null && activeItem instanceof CompItem){
	var sel = activeItem.selectedProperties;
	if(sel){
		var prevLayerIndex = -1;
		for(var i = 0 ; i < sel.length ; i++){
			if(sel[i].propertyValueType){
				if(getParentLayer(sel[i]).index != prevLayerIndex){
					$.writeln("\n====================");
					$.writeln(getParentLayer(sel[i]).name);
					$.writeln("====================");
					prevLayerIndex = getParentLayer(sel[i]).index;
				}
				$.writeln(sel[i].name + ': ' + String(sel[i].value));
			}
		}
	}
}

function getParentLayer(_property){
    //recursively gets the parent layer
    if(_property.propertyDepth>0){
        return getParentLayer(_property.parentProperty);
        }
    else{
        return _property;
        }
    }
        