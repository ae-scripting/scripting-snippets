var t1 = "h264";  //шаблоны
var t2 = "jpg"; 
var t3 = "qt_animation";

var renderAll = this;

renderAll.go = function(){

    var activeComp = app.project.activeItem;
    var selComps = app.project.selection;

    var d = new Date();
    var _date = d.getDate()+'_'+(d.getMonth()+1)+'_'+d.getFullYear();

    var fldr = new Folder(app.project.file.path + '/render_' + _date + '/');
    fldr.create();

    var comps; //делаем так, чтобы можно было закидывать как текущую, так и выбранные композиции
    if(selComps.length>0){
        var comps = selComps;
    }
    else{
        //ничего не выбрано
        if(activeComp && activeComp instanceof CompItem) var comps = [activeComp];
    }

    app.beginUndoGroup("Render comps");

    for(var c = 0; c<comps.length; c++){
        //сразу добавляем композицию на рендер
        toRenderQueue(comps[c], t1, fldr);

        //создаем DV-версию
        var dvComp = app.project.items.addComp(comps[c].name + '_DV', 720, 576, 1.09, activeComp.duration, 25);

        //докидываем солид
        dvComp.layers.addSolid([0,0,0], "Black Solid", dvComp.width, dvComp.height, dvComp.pixelAspect, dvComp.duration);

        //докидываем слой с исходной композицией
        var l = dvComp.layers.add(comps[c]);
        l.property("ADBE Transform Group").property("ADBE Scale").setValue(dvComp.pixelAspect*l.property("ADBE Transform Group").property("ADBE Scale").value/(comps[c].width/dvComp.width));

        //закидываем на рендер с настройкой t2
        toRenderQueue(dvComp, t2, fldr);
    }

    app.endUndoGroup();
}

renderAll.toRenderQueue = function(_comp, _template, _fldr){
    var rQ = app.project.renderQueue; 
    var renderit = rQ.items.add(_comp);
    renderit.outputModules[1].file = File(_fldr.fullName+"/"+_comp.name);
    renderit.outputModules[1].applyTemplate(_template);
    
}

renderAll.go()
