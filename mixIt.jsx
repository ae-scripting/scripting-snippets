//MixIt! Remixes layers based on thier position
//CC-BY, Nik Ska, 2015


var activeComp = app.project.activeItem;
if(activeComp && activeComp instanceof CompItem){
    var sel = activeComp.selectedLayers;
    if(sel.length > 0){

        app.beginUndoGroup("Remix");
        var posArray = [];

        //creating anchor point - pos array
        for(var s = 0; s < sel.length; s++){
            posArray.push([sel[s].property("ADBE Transform Group").property("ADBE Anchor Point").value, sel[s].property("ADBE Transform Group").property("ADBE Position").value]);
        }

        var i = posArray.length;

        while(i > 0){
            var rand = parseInt(Math.random()*i); //getting random index

            //setting its pos and ap
            sel[i-1].property("ADBE Transform Group").property("ADBE Anchor Point").setValue(posArray[rand][0]);
            sel[i-1].property("ADBE Transform Group").property("ADBE Position").setValue(posArray[rand][1]);

            posArray.splice(rand, 1);

            i--;
        }

        app.endUndoGroup();
    }
}