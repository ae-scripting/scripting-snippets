//Script for animated fonts placing in compositions
//Written by Nik Ska

//http://aescripts.com/authors/nik-ska/
//dokluch@gmail.com

var typefacer = this;

if($.os.substr(0,7).toLowerCase() == "windows"){var prefix = "explorer "};
else{var prefix = "open ";}

typefacer.link2 = prefix + "http://aescripts.com/authors/m-p/nik-ska/";
typefacer.link3 = prefix + "mailto:dokluch@gmail.com";
typefacer.scriptTitle = "Text Setter"
typefacer.names = {
    lettersFolder: "2. Letters",
    stagger: "Stagger",
    go: "Go!",
    defaultText: "Write some text and",
    tips:{
        stagger: "Select layers, set staggering amount and hit this button",
        go: "Click the button to place text",
    }
}
typefacer.toLower = true; //if you have only upper or lowercase letters in your font - set to true, otherwise - false

typefacer.setTextLayers = function(thisObj, _text){
    var activeComp = app.project.activeItem;
    if(activeComp && activeComp instanceof CompItem) {
        if(_text){
            if(typefacer.toLower) _text = _text.toLowerCase();

            thisObj.lettersArray = []; //we need it for staggering

            var lettersFolder = thisObj.getLettersFolder();
            if(lettersFolder){
            app.beginUndoGroup("Placing text");
            
            thisObj.posNull = activeComp.layers.addNull();
            thisObj.posNull.name = "Text Controller_"+String(thisObj.posNulls);
            
            thisObj.posNull.property("Marker").setValueAtTime(0, new MarkerValue("Adjust " + '"'+ _text +'"' + " size, tracking and position"));

            var spacing = thisObj.posNull("Effects").addProperty("ADBE Slider Control");
            spacing.name = "Tracking";
            spacing.value = 0;

            var textSize = thisObj.posNull("Effects").addProperty("ADBE Slider Control");
            textSize.name = "Size";

            thisObj.posNulls++;
            thisObj.posNull.effect(2).slider.setValue(50);
            thisObj.posNull.label = (thisObj.posNulls)%4+11;

            var letWidth = 0;
            for(var i = 0; i<_text.length; i++){
                if(_text[i]!= ' '){
                    var letterToPlace = thisObj.getLetter(_text[i], lettersFolder, thisObj.letterMap);
                    if(letterToPlace) var lettr = activeComp.layers.add(letterToPlace);
                    }
                else{
                    var lettr = activeComp.layers.add(thisObj.getLetter("space", lettersFolder, thisObj.letterMap)); 
                }
                if(lettr){
                    lettr.property("ADBE Transform Group").property("ADBE Position").setValue([0,0,0]);
                    lettr.property("ADBE Transform Group").property("ADBE Position").expression = "cntrl = thisComp.layer("+"'"+thisObj.posNull.name+"'"+");\ncntrl.toComp(-1*(cntrl.index-index+1)*([cntrl.effect(1)(1)+thisLayer.source.width, 0]*cntrl.effect(2)(1).value/100)+value)";
                    lettr.property("ADBE Transform Group").property("ADBE Scale").expression = "value*thisComp.layer("+"'"+thisObj.posNull.name+"'"+").effect(2)(1)/100";
                    lettr.threeDLayer = true;
                    if(lettr.canSetCollapseTransformation) lettr.collapseTransformation = true;
                    if(lettr.canSetTimeRemapEnabled){
                        lettr.timeRemapEnabled = true;
                        lettr.outPoint = activeComp.duration;
                    }
                    lettr.label = thisObj.posNull.label;
                    letWidth+=lettr.width; //counting total letters width to fit into comp

                    thisObj.lettersArray.push(lettr);

                    if(i>0) lettr.moveAfter(activeComp.layers[i+1])
                }
            }

            var size = 100;
            
            if(letWidth){
                var newSize = 80*activeComp.width/letWidth;
                if(newSize < 100) size = newSize;
            }

            thisObj.posNull.effect(2).slider.setValue(size);

            thisObj.posNull.property("ADBE Transform Group").property("ADBE Position").setValue([newSize*lettr.width/160,activeComp.height/2,0]);
            
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

typefacer.buildGUI = function(thisObj){
    thisObj.posNulls = thisObj.findPreviousInstances();
    thisObj.w = (thisObj instanceof Panel) ? thisObj : new Window("palette", thisObj.scriptTitle, undefined, {resizeable:false});
    thisObj.w.alignChildren = ["left", "top"];
    //thisObj.w.setBG([0,.03,.03]);
    thisObj.w.minimumSize = "width: 180, height: 155";
    thisObj.w.maximumSize = "width:180, height: 155";

    thisObj.w.add("staticText", undefined, "Animated Fonts Placer");
    var lineOne = thisObj.w.add("group{orientation:'row'}");
    var textSet = lineOne.add("editText", undefined, thisObj.names.defaultText);
    textSet.size = [115,25];

    var goBttn = lineOne.add("button", undefined, thisObj.names.go).setTip(thisObj.names.tips.go);
    goBttn.size = [30,25]

    var lineTwo = thisObj.w.add("group{orientation:'row'}");

    var setShiftBttn = lineTwo.add("button", undefined, thisObj.names.stagger).setTip(thisObj.names.tips.stagger);
    setShiftBttn.size = [60,25];

    var setShiftEdit = lineTwo.add("editText", undefined, 0);
    setShiftEdit.size = [30,25];
    lineTwo.add("staticText", undefined, "frames");

    var lineThree = thisObj.w.add("group{orientation:'row'}");
    lineThree.size = "width: 155, height: 25"

    var aboutBttn = lineThree.add("button",undefined, "?");//.setFG([1,1,1]);
    aboutBttn.alignment = ['right', 'top'];
    aboutBttn.size = [25,25];

    function getStagger(){
        if(Number(setShiftEdit.text)!=undefined){
            thisObj.staggerAmount = Number(setShiftEdit.text)
        }
        else thisObj.staggerAmount = 0; 
    }

    textSet.onEnterKey = function(){
        getStagger();
        thisObj.setTextLayers(thisObj, textSet.text);
        thisObj.staggerLayers(thisObj.lettersArray, thisObj.staggerAmount);
    }

    goBttn.onClick = function(){
        getStagger();
        thisObj.setTextLayers(thisObj, textSet.text);
        thisObj.staggerLayers(thisObj.lettersArray, thisObj.staggerAmount);
    }

    setShiftEdit.onChanging = function(){
        getStagger();
    }

    setShiftBttn.onClick = function(){
        var activeComp = app.project.activeItem;
        if(activeComp && activeComp instanceof CompItem){
            var sel = activeComp.selectedLayers;
            app.beginUndoGroup("Staggering layers");
            thisObj.staggerLayers(sel, thisObj.staggerAmount);
            app.endUndoGroup();
        }
    }


    aboutBttn.onClick = function(){
        thisObj.abt = new Window("palette", "About the script",undefined, {resizeable:false});//.setBG([0,.03,.03]);
        thisObj.abt.alignChildren = ["left", "top"];

        var abtPanel = thisObj.abt.add("panel{text: '', justify: 'center', alignment:['fill','top'], properties:{borderStyle: 'black'}}");
        abtPanel.margins = 10;
        abtPanel.alignChildren = ['left', 'top'];

        abtPanel.add("staticText", undefined, "Script for the Animated fonts placing in composition");//.setFG([1,1,1]);

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

typefacer.staggerLayers = function(_layers, _stagger){
    var activeComp = app.project.activeItem;
    if(activeComp && activeComp instanceof CompItem){
        if(_layers && _stagger){
            for(var i = 0; i <_layers.length; i++){
                _layers[i].startTime += activeComp.frameDuration*i*_stagger;
            }
        }
    }
}

typefacer.getLetter = function(_name, _folder, _map){
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

typefacer.getLettersFolder = function(){
    //function for getting letters folder
    for(var i = 1; i<= app.project.numItems; i++){
        if(app.project.item(i).name == typefacer.names.lettersFolder){

            //when we have a proper comp, update lettermap
            typefacer.letterMap = typefacer.getLetterMap(app.project.item(i), true, typefacer.toLower);

            return app.project.item(i);
            }
        }
    return null
    }

typefacer.getLetterMap = function(_folder, _cutExt, _lowerCase){
    // Gets letters listing from a letters folder
    // _cutExt stands for "cut extension" and used to remove extensions from names
    // _lowerCase

    _cutExt = _cutExt || false;
    _lowerCase = _lowerCase || false;

    var extRegExp = /(.)([.].{3})/;
    var list = [];
    if(_folder){
        for(var e = 1; e<=_folder.items.length; e++){
            var n;
            if(_cutExt){
                try{
                    n = _folder.items[e].name.match(extRegExp)[1];
                }
                catch(err){n = _folder.items[e].name};
            }
            else n = _folder.items[e].name;
            if(_lowerCase) n = n.toLowerCase();
            list.push(n);
        }
        return list;
    }
    return [];
}

typefacer.findPreviousInstances = function(){
    var activeComp = app.project.activeItem;
    var rx = /(Text Controller_)(\d)/; //regex to find prev text controllers
    var tmp = 1;
    if(activeComp && activeComp instanceof CompItem){
        var init = 1;
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

Object.prototype.setTip = function(hlpTip) {
    if(hlpTip){
        if(this.icon) this.icon.helpTip = hlpTip;
        else this.helpTip = hlpTip;
    }
    return this;
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

typefacer.buildGUI(typefacer)