//Snippet to get the property parent layer
//Nik Ska, 2013

function getParentLayer(_property){
    //recursively gets the parent layer
    if(_property.propertyDepth>0){
        return getParentLayer(_property.parentProperty);
        }
    else{
        return _property;
        }
    }   
