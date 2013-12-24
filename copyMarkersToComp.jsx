var activeComp = app.project.activeItem;
if(activeComp != null && (activeComp instanceof CompItem)){
    app.beginUndoGroup("Setting Markers");
	var sel = app.project.activeItem.selectedLayers;
    var mrkr = sel[0].property("Marker");
    for(var i = 1; i<=mrkr.numKeys;i++){
        thisMrkr = mrkr.keyValue(i);
        $.writeln(a = thisMrkr.getParameters());
        sel[0].property("Marker").setValueAtTime(thisMrkr.time, thisMrkr)
        
        sel[0].selected = false;
        app.executeCommand(2157);
        sel[0].selected = true;
        
        }
    app.endUndoGroup();
}