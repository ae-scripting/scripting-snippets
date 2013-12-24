var leader = thisComp.layer("leader");
var p = leader.position;

var stretchLim = 100; //pixel limit for stretch
var delay = 5; //frames to delay

var l = length(position.valueAtTime(0), p.valueAtTime(0));

var deltaP = p.valueAtTime(time-delay*thisComp.frameDuration)-p.valueAtTime(0);

var lastDelta = p.valueAtTime(time)-p.valueAtTime(time-delay*thisComp.frameDuration);

var newPos = value+p-p.valueAtTime(0); //new layer position w/o delay


while(length(p, newPos-lastDelta)>(l+stretchLim)){
	lastDelta-=0.1
}

newPos-lastDelta