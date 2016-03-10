//Script for attaching Nulls to selected 
//2 and 3-dimension properties
//Useful for Corner Pin, Page Turn and other effects

//USAGE:
//Select properties and launch the script

//CC-BY, Nik Ska, 2016

var prop2null = this;

prop2null.go = function() {
    var activeComp = app.project.activeItem;
    if(activeComp && activeComp instanceof CompItem){
        var sel = activeComp.selectedProperties;
        if(sel.length > 0){
            for(var s = 0; s < sel.length; s++){
                if(sel[s] instanceof Property){
                    //Choose only selected Properties (not Property Groups)
                    if((sel[s].value instanceof Array) && (sel[s].canVaryOverTime === true)){
                        //Choose only 2/3d and those you can apply expression to
                        var newNull = activeComp.layers.addNull();
                        newNull.label = 13;
                        newNull.name = sel[s].name + " control";
                        newNull.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([50, 50]);
                        newNull.property("ADBE Transform Group").property("ADBE Scale").expression = "[100, 100]";
                        newNull.property("ADBE Transform Group").property("ADBE Position").setValue(sel[s].value);
                        sel[s].expression = "thisComp.layer(" +'"' + newNull.name + '"' + ")('ADBE Transform Group')('ADBE Position')";
                    }
                }
            }
        }
    }
}

app.beginUndoGroup("Properties to Nulls");
prop2null.go();
app.endUndoGroup();
