//Sets all Stroke caps to Round in all shape groups
//CC-BY, Nik Ska, 2014

ShapeLayer.prototype.setRoundStrokeCap = function(){
    //sets keys inside shapes
    var thisShape = this.containingComp;
    var findPath = function(_group){
        for(var p = 1; p <= _group.numProperties; p++){
            //cycle through the properies
            if(_group.property(p) instanceof PropertyGroup){
                //when found a group – going deeper
                findPath(_group.property(p))
            }
            if(_group.property("ADBE Vector Graphic - Stroke")){
                //when found a Stroke and it's legit
                //set Line Cap to Round
                _group.property("ADBE Vector Graphic - Stroke").property("ADBE Vector Stroke Line Cap").setValue(2);
            }
        }
    }

    findPath(this.property("ADBE Root Vectors Group"))
}

var setRoundCaps = function(){
    //wrapper function
    var activeComp = app.project.activeItem;
    if(activeComp && activeComp instanceof CompItem){
        var sel = activeComp.selectedLayers;
        if(sel.length > 0){
            app.beginUndoGroup("Making all caps round");
            
            for(var s = 0; s < sel.length; s++){
                if(sel[s] instanceof ShapeLayer){
                    sel[s].setRoundStrokeCap();
                }
            }

            app.endUndoGroup();
        }
    }
}

setRoundCaps();
