var setColors = this;

setColors.run = function(){
    this.buildGUI(this);
}

setColors.buildGUI = function(thisObj){
	thisObj.w = (thisObj instanceof Panel) ? thisObj : new Window("palette", thisObj.scriptTitle, undefined, {resizeable:true});
	thisObj.w.alignChildren = ['left', 'top']
	var g = thisObj.w.add("group{orientation:'column', alignChildren: ['left', 'top']}");
	g.add("staticText", undefined, "select color");
	var rbuttons = g.add("panel");
	var radio1 = rbuttons.add ("radiobutton", undefined, "1");
	var radio2 = rbuttons.add ("radiobutton", undefined, "2");
	var radio3 = rbuttons.add ("radiobutton", undefined, "3");
	var radio4 = rbuttons.add ("radiobutton", undefined, "4");
	var radio5 = rbuttons.add ("radiobutton", undefined, "5");
	rbuttons.size = [80,160];
	radio1.value = true;

	var select = 1;

	var set = g.add("button",undefined,"Set")

	set.onClick = function(){
		if(radio1.value == true) select = 1;
		else if(radio2.value == true) select = 2;
		else if(radio3.value == true) select = 3;
		else if(radio4.value == true) select = 4;
		else if(radio5.value == true) select = 5;
		setColors.set(select);
	}

	if (thisObj.w instanceof Window){
	    thisObj.w.center();
	    thisObj.w.show();
	}
	else thisObj.w.layout.layout(true);
}

setColors.set = function(colNum){
	var expr = 'comp("!control").layer("colors")("ADBE Effect Parade")("c' + String(colNum)+'")("ADBE Color Control-0001")';
	var activeComp = app.project.activeItem; 
	if(activeComp && activeComp instanceof CompItem){ //если активный элемент - композиция
		var sel = activeComp.selectedProperties; //выбранные свойства
		if(sel.length > 0){ //если что-то выбрано
			if(sel[0].propertyValueType == PropertyValueType.COLOR){ //если это цвет
				sel[0].expression = expr;
			}
		}
	}
}

setColors.run();