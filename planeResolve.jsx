l = thisComp.layer("Null 91")
var pos = l.position

if(length(sub(pos, pos.valueAtTime(time+thisComp.frameDuration)))) toComp(value*length(sub(pos, pos.valueAtTime(time+thisComp.frameDuration))))
else 0
