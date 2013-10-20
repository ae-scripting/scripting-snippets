var activeComp = app.project.activeItem;  

if(activeComp != null && activeComp instanceof CompItem){
    activeComp.width = 10;
    activeComp.height = 10;

    }


var getClosest16 = function(a){
	if(a%16 == 0) return a;
	else return 16*(Math.floor(a/16)+1);
}