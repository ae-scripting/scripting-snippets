var makeCompSize = this;
makeCompSize.go = function(){
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

makeCompSize.go(); 