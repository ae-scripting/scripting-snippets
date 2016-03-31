//Sets selected Solids and Adjustment Layers size to comp size
//CC-BY, Nik Ska, 2016

var makeCompSize = this;
makeCompSize.go = function(reset){
    
    reset = false || reset;
    var activeComp = app.project.activeItem;
    if (activeComp && activeComp instanceof CompItem) {

        var sel = activeComp.selectedLayers;
        if (sel.length > 0) {
            app.beginUndoGroup("Changing layers size");
            for(var s = 0; s < sel.length; s++){
                if(sel[s] instanceof AVLayer){
                    try{
                        sel[s].source.width = activeComp.width;
                        sel[s].source.height = activeComp.height;
                        if(reset){
                            sel[s].property("ADBE Transform Group").property("ADBE Position").setValue([activeComp.width, activeComp.height]/2);
                            sel[s].property("ADBE Transform Group").property("ADBE Anchor Point").setValue([activeComp.width, activeComp.height]/2);
                            sel[s].property("ADBE Transform Group").property("ADBE Scale").setValue([100,100]);
                            sel[s].property("ADBE Transform Group").property("ADBE Rotate Z").setValue(0);
                        }
                    }
                    catch(err){
                        null;
                    }
                }
            }
            app.endUndoGroup();
        }
    }
}

makeCompSize.go(true); 