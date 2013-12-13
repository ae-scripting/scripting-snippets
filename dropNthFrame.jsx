//Script drops every Nth frame starting from the defined frame

var activeItem = app.project.activeItem;
if(activeItem != null && activeItem instanceof CompItem){
    
    var frameStart = 3; //when to start
    var delta = 6; //step
    var fd = activeItem.frameDuration;
    var sel = activeItem.selectedLayers;
    if(sel != null){
        if(sel[0].timeRemapEnabled == false) sel[0].timeRemapEnabled = true;
        else{
            var curFrame = frameStart*fd;
            var tr = sel[0].property("ADBE Time Remapping");
            var shift = 0;
            while(curFrame<sel[0].source.duration){
                tr.setValueAtKey(tr.addKey(curFrame-shift), curFrame); //add first
                tr.setValueAtKey(tr.addKey((curFrame+fd-shift)), (curFrame+2*fd)); //add second +shift
                curFrame+=delta*fd; //increment frame
                shift+=fd; //increment shift
            }
        }
    }
}   