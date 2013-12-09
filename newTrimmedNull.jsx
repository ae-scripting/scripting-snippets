//Snippet for new trimmed null creation
//creates a null trimmed to the highest selected layer
//inherits its color
//CC-BY-SA Nik Ska, 2013

var newNull = {}

newNull.go = function(){
	var activeComp = app.project.activeItem; //открытая композиция
	if(activeComp && activeComp instanceof CompItem){ //если это все же композиция 
		var sel = activeComp.selectedLayers; //выбранные слои
		app.beginUndoGroup("Create smart null"); //начинаем Undo
		var nullLayer = activeComp.layers.addNull(); //добавляем нуль
		if(sel){ //если что-то выбрано
			sel.sort(function(a,b){ //Хитрая сортировка на JS
				return a.index - b.index;
			});
			nullLayer.moveBefore(sel[0]); //перемещаем перед первым выбранным
			nullLayer.startTime = sel[0].startTime; //подрезаем
			nullLayer.inPoint = sel[0].inPoint;
			nullLayer.outPoint = sel[0].outPoint;
			nullLayer.label = sel[0].label; //наследуем цвет
		}
		app.endUndoGroup(); //закрываем Undo
	}
}
newNull.go() //поехали!