//Trim First Selected layer to the second
//CC-BY-SA Nik Ska, 2013

var ns_Trim = {}

ns_Trim.go = function(){
	var activeComp = app.project.activeItem; //открытая композиция
	if(activeComp && activeComp instanceof CompItem){ //если это все же композиция 
		var sel = activeComp.selectedLayers; //выбранные слои
		app.beginUndoGroup("Trim"); //начинаем Undo
		if(sel.length>1){ //если выбрано больше 1 элемента
			sel[0].startTime = sel[1].startTime; //подрезаем
			sel[0].inPoint = sel[1].inPoint;
			sel[0].outPoint = sel[1].outPoint;
			var prev = sel[1]; //запоминаем предыдущий слой
		}
		else if(prev){
			//теперь можно выбирать слои по одному и подрезать
			//под предыдущий
			sel[0].startTime = prev.startTime;
			sel[0].inPoint = prev.inPoint;
			sel[0].outPoint = prev.outPoint;
		}

		app.endUndoGroup(); //закрываем Undo
	}
}
ns_Trim.go() //поехали!