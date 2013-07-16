//Just a little function to get the property parent layer
//Nik Ska

function getParentLayer(_property){
    //recursively gets the parent layer
    if(_property.propertyDepth>0){
        return getParentLayer(_property.parentProperty);
        }
    else{
        return _property;
        }
    }   
