/*
This script is used to set a classic bounce expression
to the selected property and link it to three sliders
for amplitude, frequency and decay created on the layer

CC-BY-SA, Nik Ska, 2014
*/

var setBounce = this;

setBounce.go = function(){

    app.beginUndoGroup("Set Bounce Expression");

    var activeComp = app.project.activeItem;
    if(activeComp && activeComp instanceof CompItem){
        var sel = activeComp.selectedProperties;
        if(sel.length > 0){
            if(sel[0].canSetExpression){
                //controller names
                var n1 = "BC_amp_" + sel[0].name;
                var n2 = "BC_freq_" + sel[0].name;
                var n3 = "BC_decay_" + sel[0].name;

                //creating the expression
                var newExpr = "n = 0;\nif (numKeys > 0){\n\tn = nearestKey(time).index;\n\tif (key(n).time > time) n--;\n}\n\nif (n == 0) t = 0;\nelse t = time - key(n).time;\n\nif (n > 0){\n\tv = velocityAtTime(key(n).time - thisComp.frameDuration/10);\n\tamp = thisLayer('ADBE Effect Parade')("+ "'" + n1 + "'" + ")('ADBE Slider Control-0001');\n\tfreq = thisLayer('ADBE Effect Parade')(" + "'" + n2 + "'" + ")('ADBE Slider Control-0001');\n\tdecay = thisLayer('ADBE Effect Parade')(" + "'" + n3 + "'" +")('ADBE Slider Control-0001');\n\tvalue + v*amp*Math.sin(freq*t*2*Math.PI)/Math.exp(decay*t);\n}\nelse{\n\tvalue;\n}";

                var pLayer = setBounce.getParentLayer(sel[0]); //parent layer
                //creatin sliders
                setBounce.setSlider(pLayer, n1, 0.025, '');
                setBounce.setSlider(pLayer, n2, 2, '')
                setBounce.setSlider(pLayer, n3, 3, '')
                sel[0].expression = newExpr;

            }
        }
    }

    app.endUndoGroup();
}

setBounce.getParentLayer = function(_property){
    //recursively gets the parent layer
    if(_property.propertyDepth>0){
        return getParentLayer(_property.parentProperty);
    }
    else{
        return _property;
    }
} 

setBounce.setSlider = function(masterLayer, slName, slValue, slExpression){
  //adding a slider to the master layer
  var sl = masterLayer.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
  sl.name = slName;
  sl.property("ADBE Slider Control-0001").setValue(slValue);
  sl.property("ADBE Slider Control-0001").expression = slExpression;
}

setBounce.go();