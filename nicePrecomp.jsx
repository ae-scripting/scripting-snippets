//Experiment to make nice and clean precomps

//CC-BY-SA Nik Ska, 2013

var precompFixer = {}

precompFixer.go = function(){
	function getTimes(_sel){
		var end = 0; //ищем конец последнего слоя
		for(var e = 1; e <= _sel.length; e++){
			if(_sel[e].outPoint>end) end = _sel[e].outPoint;
		}
		var begin = end; //ищем начало первого слоя
		for(var b = 1; b <= _sel.length; b++){
			if(_sel[b].inPoint<begin) begin = _sel[b].inPoint;
		}
		return([begin, end])
	}

	var activeComp = app.project.activeItem; //открытая композиция
	if(activeComp && activeComp instanceof CompItem){ //если это все же композиция 
		var sel = activeComp.selectedLayers; //выбранные слои
		app.beginUndoGroup("Nice Precomp"); //начинаем Undo
		if(sel.length == 1 && sel[0].source instanceof CompItem){ //если мы выбрали прекомп
			var precomp = sel[0].source; //берем сам прекомп
			var timings = getTimes(precomp.layers); //рассчитываем начало и конец
			precomp.duration = timings[1]-timings[0]; //рассчитываем новую длину
			precomp.displayStartTime = timings[0]; //сдвигаем Display Start Time
			sel[0].startTime+=timings[0]; //сдвигаем сам прекомп
			for(var l = 1 ; l <= precomp.layers.length ; l++){
				precomp.layers[l].startTime -= timings[0]; //сдвигаем слои внутри
			}
		}
		app.endUndoGroup(); //закрываем Undo
	}
}
precompFixer.go() //поехали!