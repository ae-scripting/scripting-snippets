//HUD text placer
//Written by Nik Ska
//Excusively for George Hurdubae
//http://aescripts.com/authors/nik-ska/
//dokluch@gmail.com

var textSetter = this;

if($.os.substr(0,7).toLowerCase() == "windows"){var prefix = "explorer "};
else{var prefix = "open ";}

textSetter.link1 = prefix + "http://videohive.net/item/animated-hud-alphabet/5080801";
textSetter.link2 = prefix + "http://aescripts.com/authors/m-p/nik-ska/";
textSetter.link3 = prefix + "mailto:dokluch@gmail.com";
textSetter.letterMap = ['0','1','2','3','4','5','6','7','8','9',"'",'-','!','"','#','$','%','&','(',')',',','.','/',':',';','?','@','[',"\\",']','€','+','<','=','>','A','a','B','b','C','c','D','d','E','e','F','f','G','g','H','h','I','i','J','j','K','k','L','l','M','m','N','n','O','o','P','p','Q','q','R','r','S','s','space','T','t','U','u','V','v','W','w','X','x','Y','y','Z','z'];



textSetter.setTextLayers = function(thisObj, _text){
    var activeComp = app.project.activeItem;
    if(activeComp != null && (activeComp instanceof CompItem)) {
        if(_text){
            var lettersFolder = thisObj.getLettersFolder();
            if(lettersFolder){
            app.beginUndoGroup("Placing HUD text");
            
            thisObj.posNull = activeComp.layers.addNull();
            thisObj.posNull.name = "Text Controller_"+String(thisObj.posNulls);
            
            thisObj.posNull.property("Marker").setValueAtTime(0, new MarkerValue("Adjust " + '"'+ _text +'"' + " size, tracking and position"));

            var spacing = thisObj.posNull("Effects").addProperty("ADBE Slider Control");
            spacing.name = "Tracking";
            spacing.value = 0;

            var textSize = thisObj.posNull("Effects").addProperty("ADBE Slider Control");
            textSize.name = "Size";

            thisObj.posNull.effect(2).slider.setValue(100);

            thisObj.posNulls++;

            thisObj.posNull.label = (posNulls)%4+11;
            thisObj.posNull.transform.position.setValue([-1104,584,0]);

            
            for(var i = 0; i<_text.length; i++){
                if(_text[i]!= ' '){
                    var letterToPlace = thisObj.getLetter(_text[i], lettersFolder, thisObj.letterMap);
                    if(letterToPlace) var lettr = activeComp.layers.add(letterToPlace);
                    }
                else{
                    var lettr = activeComp.layers.add(thisObj.getLetter("space", lettersFolder, thisObj.letterMap)); 
                }
                if(lettr){
                    lettr.position.setValue([0,0,0]);
                    lettr.position.expression = "cntrl = thisComp.layer("+"'"+thisObj.posNull.name+"'"+");\ncntrl.toComp(cntrl.transform.anchorPoint) - (cntrl.index-index)*(7*cntrl.effect(2)(1)+cntrl.effect(1)(1))+value";
                    lettr.scale.expression = "value*thisComp.layer("+"'"+thisObj.posNull.name+"'"+").effect(2)(1)/100";
                    lettr.threeDLayer = true;
                    lettr.collapseTransformation = true;
                    lettr.label = thisObj.posNull.label;
                    if(i>0) lettr.moveAfter(activeComp.layers[i+1])
                }
            }
            
            if(activeComp.layers[1]!=thisObj.posNull){
                thisObj.posNull.moveBefore(activeComp.layers[1])
            }

            for(var k = 1; k<=activeComp.layers.length; k++){
                var l = activeComp.layers[k];
                if((l.name == "Master Controller") || (l.name == "Camera Controller") || (l.name == "Camera")){
                    l.moveBefore(activeComp.layers[1]);
                }
            }
            app.endUndoGroup();   
            }
        }
    }
}

textSetter.buildGUI = function(thisObj){
     thisObj.posNulls = thisObj.findPreviousInstances();
     thisObj.w = (thisObj instanceof Panel) ? thisObj : new Window("palette", thisObj.scriptTitle, undefined, {resizeable:false});
     thisObj.w.alignChildren = ["left", "top"];
     //thisObj.w.setBG([0,.03,.03]);
     thisObj.w.minimumSize = "width: 180, height: 110";
     thisObj.w.maximumSize = "width:180, height: 110";

     thisObj.w.add("staticText", undefined, "HUD text placer");
     var textSet = thisObj.w.add("editText", undefined, "Write text and hit Enter");
     textSet.size = [150,20];

     var lineTwo = thisObj.w.add("group{orientation:'row'}");
     lineTwo.size = "width: 155, height: 25"
     
     var aboutBttn = lineTwo.add("button",undefined, "?");//.setFG([1,1,1]);
     aboutBttn.alignment = ['right', 'top'];
     aboutBttn.size = [20,20];
     
     textSet.onEnterKey = function(){
        setTextLayers(thisObj, textSet.text);
     }
     

     aboutBttn.onClick = function(){
        thisObj.abt = new Window("palette", "About the script",undefined, {resizeable:false});//.setBG([0,.03,.03]);
        thisObj.abt.alignChildren = ["left", "top"];

        var abtPanel = thisObj.abt.add("panel{text: '', justify: 'center', alignment:['fill','top'], properties:{borderStyle: 'black'}}");
        abtPanel.margins = 10;
        abtPanel.alignChildren = ['left', 'top'];

        abtPanel.add("staticText", undefined, "Script for the HUD Alphabet by IronykDesign");//.setFG([1,1,1]);
        abtPanel.add("staticText", undefined, "http://videohive.net/item/animated-hud-alphabet/5080801").setFG([1, 0.58, 0.0]).addEventListener("mouseup", function(k){
            if(k.button == 0){
                system.callSystem(thisObj.link1)
            }
        });

        abtPanel.add("staticText", undefined, "");
        abtPanel.add("staticText", undefined, "Code by Nik Ska");
        abtPanel.add("staticText", undefined, "http://aescripts.com/authors/m-p/nik-ska/").setFG([1, 0.58, 0.0]).addEventListener("mouseup", function(k){
            if(k.button == 0){
                system.callSystem(thisObj.link2);
            }
        });
        abtPanel.add("staticText", undefined, "dokluch@gmail.com").setFG([1, 0.58, 0.0]).addEventListener("mouseup", function(k){
            if(k.button == 0){
                system.callSystem(thisObj.link3);
            }
        });
        
        thisObj.abt.center();
        thisObj.abt.show();
     }

     if (thisObj.w instanceof Window){
        thisObj.w.center();
        thisObj.w.show();
    }
    else thisObj.w.layout.layout(true);
}


textSetter.getLetter = function(_name, _folder, _map){
    function find(n, m){
        for(var i = 0; i<m.length; i++){
            if(m[i] == n) return i
            }
        return -1
        }

    var letterNumber =  find(_name, _map);

    if(letterNumber>=0){
        return _folder.item(letterNumber+1)
    }
    else return null    
}

textSetter.getLettersFolder = function(){
    for(var i = 1; i<= app.project.numItems; i++){
        if(app.project.item(i).name == "2. Letters"){
            return app.project.item(i);
            }
        }
    return null
    }

textSetter.findPreviousInstances = function(){
    var activeComp = app.project.activeItem;
    var rx = /(Text Controller_)(\d)/;
    if(activeComp){
        var init = 1;
        var tmp = 1;
        for(var k = 1; k<=activeComp.layers.length; k++){
            var match = activeComp.layers[k].name.match(rx);
            if(match){ 
                if(Number(match[2])>init) init = Number(match[2]);
            }
            if(init>tmp) tmp = init;
            else if(init == tmp) tmp ++;
        }
    }
    return tmp;
}

Object.prototype.setBG = function (colorArray) {
    if (typeof colorArray != 'undefined' && colorArray.length >=3) {
        this.graphics.backgroundColor = this.graphics.newBrush(this.graphics.BrushType.SOLID_COLOR, colorArray);
    }
    return this;
}

Object.prototype.setFG = function(colorArray) {
    if (typeof colorArray != 'undefined' && colorArray.length >=3) {
        this.graphics.foregroundColor = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, colorArray, 1);
    }
    return this;
}

textSetter.buildGUI(textSetter)