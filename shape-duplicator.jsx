//Shape Duplicator - a tool to duplicate shape layer into another group
//!!!alpha version

//An attempt to create the function which will duplicate a shape group into the selected group
//similar to Ctrl-G command which is missing in ExtendScript
//The main idea is to recursively walk over all the properties and property groups
//of a shape layer and then to create similar objects with similar hierarchy in another group


//Known troubles
//--Stroke dashes and gaps are now not supported
//--Gradients are not copied
//--Keyframe Interpolation visually right, actually wrong
//--Tangents are not supported

//Nik Ska, 2013, CC-BY

//now it's manual
//use rd-GimmePropPath to get these paths
var donor = app.project.item(2).layer("Shape Layer 1").property("Contents").property("Shape 1");

//creating group with the same name
var recipient = app.project.item(2).layer("Shape Layer 1").property("Contents").property("Group 1").property("ADBE Vectors Group").addProperty("ADBE Vector Group");
recipient.name = donor.name

app.beginUndoGroup("Duplicate shape")
duplicateShapeIntoGroup(donor, recipient)
app.endUndoGroup()

function duplicateShapeIntoGroup(copyThis, pasteHere){
		for(var i = 1; i <= copyThis.numProperties; i++){
			if(copyThis.property(i).propertyType != PropertyType.PROPERTY){
                //if we got a group
                //$.writeln("\n\ngroup__"+copyThis.property(i).matchName+' - ' +copyThis.property(i).name + '\n' + String(copyThis.property(i).hidden));
                if(pasteHere.canAddProperty(copyThis.property(i).matchName)){
                    var pasteGroup = pasteHere.addProperty(copyThis.property(i).matchName);
                }
            
                else pasteGroup = copyThis.property(i);   
                
                //setting name if we can
                try{
                    pasteGroup.name = copyThis.property(i).name;
                    pasteGroup.enabled = copyThis.property(i).enabled;
                    }
                catch(err){null}

                duplicateShapeIntoGroup(copyThis.property(i), pasteGroup)
        }

		else{
            //$.writeln(copyThis.property(i).matchName + ' ' + String(copyThis.property(i).value));
            if(copyThis.property(i).matchName.match(/(.*)([ ]\d)/)!=null && (copyThis.property(i).matchName.match(/(.*)([ ]\d)/)[1] == "ADBE Vector Stroke Dash" || copyThis.property(i).matchName.match(/(.*)([ ]\d)/)[1] == "ADBE Vector Stroke Gap")){
                    //somehow it doesn't add this property, but it really should do it
                    //also breakpoints do not work here
                    //fuck this shit
                    pasteHere.addProperty(copyThis.property(i).matchName); 
                    //$.writeln(pasteHere.name + '\t' + copyThis.property(i).matchName + '\t' + pasteHere.canAddProperty(copyThis.property(i).matchName));
            }

            else{
                try{
                    //We need this for hidden 3D transform group that throws error in 3D mode
                    var thisProp = pasteHere.property(copyThis.property(i).matchName);
                    var copyProp = copyThis.property(i);

                    if(copyProp.isTimeVarying == true){
                        //copy keyframes
                        for(var j = 1 ; j <= copyProp.numKeys ; j++){
                            thisProp.addKey(copyProp.keyTime(j))
                            thisProp.setValueAtKey(j, copyProp.keyValue(j))
                            //interpolation type. should also add for tangents
                            thisProp.setInterpolationTypeAtKey(j, copyProp.keyInInterpolationType(j), copyProp.keyOutInterpolationType(j));


                            //somehow this doesn't work
                            //thisProp.setSpatialTangentsAtKey(j, copyProp.keyInSpatialTangent(j), copyProp.keyOutSpatialTangent(j))
                        }
                    }
                    else thisProp.setValue(copyThis.property(i).value);

                    if(thisProp.canSetExpression == true) thisProp.expression = copyThis.property(i).expression;
                }
                catch(err){null}
            }
        }
    }
}