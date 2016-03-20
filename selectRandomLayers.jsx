//Takes current selection and randomizes it
//CC-BY, Nik Ska, 2016

var selRandomLayers = this;

selRandomLayers.go = function(){
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    var activeComp = app.project.activeItem;
    if(activeComp && activeComp instanceof CompItem){
        var sel = activeComp.selectedLayers;
        if(sel.length > 0){
            app.beginUndoGroup("Select Random Layers");
            var selPrev = sel;
            var selNew = shuffle(sel);
            for(var s = selPrev.length-1; s >= 0; s--){
                selPrev[s].selected = false
            };
            for(var s = selNew.length-1; s >= 0; s--){
                selNew[s].selected = true;
            };
            app.endUndoGroup();
        }
    }
}

selRandomLayers.go();