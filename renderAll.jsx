//Script for creating DV version of active or se;ected comps
//and rendering them with preset templates
//to the "render" subfolder of a project folder

//Templates
var t1 = "h264";  
var t2 = "jpg"; 
var t3 = "qt_animation";

var renderAll = this;

renderAll.go = function(){

    //getting active element and selected elements
    var activeComp = app.project.activeItem;
    var selComps = app.project.selection;

    //getting currect date for render folder maning
    //not mandatory
    var d = new Date();
    var _date = d.getDate()+'_'+(d.getMonth()+1)+'_'+d.getFullYear();

    //creating "render" folder
    var fldr = new Folder(app.project.file.path + '/render_' + _date + '/');
    fldr.create();

    var comps;
    if(selComps.length>0){
        var comps = selComps; //if some comps are selected - work on them
    }
    else{
        //otherwise if we're in a composition - use it
        if(activeComp && activeComp instanceof CompItem) var comps = [activeComp];
    }

    app.beginUndoGroup("Render comps");

    for(var c = 0; c<comps.length; c++){
        //put the comp into the render queue
        toRenderQueue(comps[c], t1, fldr);

        //creating DV version
        //not mandatory
        var dvComp = app.project.items.addComp(comps[c].name + '_DV', 720, 576, 1.09, activeComp.duration, 25);
        dvComp.layers.addSolid([0,0,0], "Black Solid", dvComp.width, dvComp.height, dvComp.pixelAspect, dvComp.duration);

        //adding initial comp as layer
        var l = dvComp.layers.add(comps[c]);
        //fit scale to width
        l.property("ADBE Transform Group").property("ADBE Scale").setValue(dvComp.pixelAspect*l.property("ADBE Transform Group").property("ADBE Scale").value/(comps[c].width/dvComp.width));

        //put it into render queue with t2 template
        toRenderQueue(dvComp, t2, fldr);
    }

    app.endUndoGroup();
}

renderAll.toRenderQueue = function(_comp, _template, _fldr){
    //this function takes _comp composition and puts it into the render queue
    //with _template template and renders it to the _fldr folder
    var rQ = app.project.renderQueue; 
    var renderit = rQ.items.add(_comp);
    renderit.outputModules[1].file = File(_fldr.fullName+"/"+_comp.name);
    renderit.outputModules[1].applyTemplate(_template);
    
}

renderAll.go()
