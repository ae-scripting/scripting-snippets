//snippet used to sort layers depending on their position, left to right


var sortByPosition = this

sortByPosition.go = function(type){
    //type is "left", "right", "top" or "bottom"
    //whick stands for left to right, right to left, top to bottom, bottom to top respectively
    var activeComp = app.project.activeItem;

    if(activeComp && activeComp instanceof CompItem){
        var sel = activeComp.selectedLayers;

        if(type == "left" || type == "right"){
            sel.sort(function(a,b){
                if(a.transform.position.value[0] <= b.transform.position.value[0]){
                    if(type == "left") return 1;
                    else return -1;
                }
                else if(a.transform.position.value[0] > b.transform.position.value[0]){
                    if(type == "left") return -1;
                    else return 1;
                }
                else return 0;
            });
        }
        
        if(type == "top" || type == "bottom"){
            sel.sort(function(a,b){
                if(a.transform.position.value[1] <= b.transform.position.value[1]){
                    if(type == "top") return 1;
                    else return -1;
                }
                else if(a.transform.position.value[1] > b.transform.position.value[1]){
                    if(type == "top") return -1;
                    else return 1;
                }
                else return 0;
            });
        } 
         
        app.beginUndoGroup("sort")

        for(var s = 1; s<sel.length; s++){
            sel[s].moveBefore(sel[s-1])
        }

        app.endUndoGroup()
    }

}

sortByPosition.go("left")