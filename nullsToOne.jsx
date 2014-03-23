//Snippet for converting a pack of nulls into one
//each null represents a frame

//CC-BY Nik Ska, 2014

var activeComp = app.project.activeItem;
if(activeComp && activeComp instanceof CompItem){
    var sel = activeComp.selectedLayers;
    if(sel.length > 0){
        app.beginUndoGroup("Converting nulls to one");
        var newTrackNull = activeComp.layers.addNull();
        newTrackNull.name = "MasterNull";
        newTrackNull.threeDLayer = true;

        for(var s = 0; s < sel.length; s++){
            t = s*activeComp.frameDuration; //time
            var currentNull = sel[s];
            //set all properties
            newTrackNull.property("ADBE Transform Group").property("ADBE Position").setValueAtTime(t, currentNull.property("ADBE Transform Group").property("ADBE Position").value);

            newTrackNull.property("ADBE Transform Group").property("ADBE Anchor Point").setValueAtTime(t, currentNull.property("ADBE Transform Group").property("ADBE Anchor Point").value);

            newTrackNull.property("ADBE Transform Group").property("ADBE Rotate Z").setValueAtTime(t, currentNull.property("ADBE Transform Group").property("ADBE Rotate Z").value);

            if(sel[s].threeDLayer){
                newTrackNull.property("ADBE Transform Group").property("ADBE Rotate X").setValueAtTime(t, currentNull.property("ADBE Transform Group").property("ADBE Rotate X").value);

                newTrackNull.property("ADBE Transform Group").property("ADBE Rotate Y").setValueAtTime(t, currentNull.property("ADBE Transform Group").property("ADBE Rotate Y").value);

                newTrackNull.property("ADBE Transform Group").property("ADBE Orientation").setValueAtTime(t, currentNull.property("ADBE Transform Group").property("ADBE Orientation").value);

            }
        }

        app.endUndoGroup();
    }
}