/*
Sets keyframes so that you have hard-coded "typewriter" effect
of a Text Layer

*/

var textToKeys = function(){

    var activeComp = app.project.activeItem;
    if(activeComp && activeComp instanceof CompItem){
        var sel = activeComp.selectedLayers;
        if(sel.length > 0){
            app.beginUndoGroup("Make txt keys");
            
            for(var s = 0; s < sel.length; s++){
                if(sel[s] instanceof TextLayer){
                    var txt = sel[s].property("ADBE Text Properties").property("ADBE Text Document");
                    var txtString = sel[s].property("ADBE Text Properties").property("ADBE Text Document").value.text;
                    // txt.setValueAtTime(activeComp.time, '')
                    for(var t = 0; t <= txt.length; t++){
                        txt.setValueAtTime(activeComp.time + t*activeComp.frameDuraiton*2, txtString.substr(0,t))
                    }
                }
            }
            app.endUndoGroup();
        }
    }
}