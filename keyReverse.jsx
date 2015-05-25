//ReverseKeys just does what it says is does - reverses keyframes
//Just select a bunch of keyframes and the script will reverse them at the playhead

//CC-BY, Nik Ska, 2015

var reverseKeys = this;

reverseKeys.go = function() {
    var activeComp = app.project.activeItem;
    if(activeComp && activeComp instanceof CompItem){
        var sel = activeComp.selectedLayers;
        if(sel.length > 0){
            app.beginUndoGroup("reversing keys");
            
            
            for(var l = 0; l < sel.length; l++){
                thisLayer = sel[l];

                if(thisLayer.selectedProperties.length > 0){
                    for(var p = 0; p < thisLayer.selectedProperties.length; p++){
                        thisProperty = thisLayer.selectedProperties[p];

                        //if there are more than 1 keyframes selected
                        if(thisProperty.selectedKeys.length > 1){
                            var keys = thisProperty.selectedKeys;


                            var newKeyTime = activeComp.time;
                            for (var k = 0; k < keys.length; k++) {

                                //creating a new key
                                var newKeyIndex = thisProperty.addKey(newKeyTime);

                                //getting spatial and temporal ease values
                                var newKeyInSpatialTangent = thisProperty.keyInSpatialTangent(keys[keys.length - k - 1]);
                                var newKeyOutSpatialTangent = thisProperty.keyOutSpatialTangent(keys[keys.length - k - 1]);

                                var newKeyInTemporalEase = thisProperty.keyInTemporalEase(keys[keys.length - k - 1]);
                                var newKeyOutTemporalEase = thisProperty.keyOutTemporalEase(keys[keys.length - k - 1]);

                                //setting both value and tangents / easing
                                thisProperty.setValueAtKey(newKeyIndex, thisProperty.keyValue(keys[keys.length - k - 1]));
                                thisProperty.setSpatialTangentsAtKey(newKeyIndex, newKeyOutSpatialTangent, newKeyInSpatialTangent)
                                thisProperty.setTemporalEaseAtKey(newKeyIndex, newKeyOutTemporalEase, newKeyInTemporalEase)

                                //updating time
                                if(k < keys.length - 1){
                                    newKeyTime += thisProperty.keyTime(keys[keys.length - k - 1]) - thisProperty.keyTime(keys[keys.length - k - 2]);
                                }
                            }
                        }
                    }
                    
                }
            }

            app.endUndoGroup();
            
        }
    }
}

reverseKeys.go();

