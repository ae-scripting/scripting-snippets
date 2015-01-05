//Set keyframe for all paths in a shape layer
//CC-BY, Nik Ska, 2014

ShapeLayer.prototype.setKeysForPaths = function(){
    //sets keys inside shapes
    var thisShape = this.containingComp;
    var findPath = function(_group){
        for(var p = 1; p <= _group.numProperties; p++){
            //cycle through the properies
            if(_group.property(p) instanceof PropertyGroup){
                //when found a group – going deeper
                findPath(_group.property(p))
            }
            if(_group.property("ADBE Vector Shape")){
                //when found a Path and it's legit
                if(_group.property("ADBE Vector Shape").canVaryOverTime){
                    _group.property("ADBE Vector Shape").addKey(thisShape.time);
                }
            }
        }
    }

    findPath(this.property("ADBE Root Vectors Group"))
}

var setKeysForPathsMain = function(){
    //wrapper function
    var activeComp = app.project.activeItem;
    if(activeComp && activeComp instanceof CompItem){
        var sel = activeComp.selectedLayers;
        if(sel.length > 0){
            app.beginUndoGroup("Setting keyframes for shapes");
            
            for(var s = 0; s < sel.length; s++){
                if(sel[s] instanceof ShapeLayer){
                    sel[s].setKeysForPaths();
                }
            }

            app.endUndoGroup();
        }
    }
}

setKeysForPathsMain();
