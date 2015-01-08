//Экспрешн, который позволяет менять значение одного кейфрейма, с сохранением кривых анимации. Править первые две строчки

myKfNum = 3;//номер кейфрема
myKfNewValue = 180;//новое значение для этого кейфрейма

Array.prototype.linear = function(tMin,tMax,val1,val2)
{
	if(arguments.length<4)
		return this;
	for(var i=0;i<arguments.length;i++)
		if(!arguments[i] instanceof Array)
			return this;

	var newVal = [];
	for(var k=0;k<this.length;k++)
		if(tMin[k]<=tMax[k])
			newVal[k] = linear(this[k],tMin[k],tMax[k],val1[k],val2[k]);
		else
			newVal[k] = linear(this[k],tMin[k],tMax[k],val2[k],val1[k]);
	return newVal;
}

myKfOldValue = key(myKfNum).value//старое значение маркера
myKfTime = key(myKfNum).time//время кейфрейма

if(time <= myKfTime)//участок до нашего кейфрейма
	if(myKfNum == 1)//если это первый кейфрейм
		myKfNewValue;//не анимируем анимацию до него (её нет)
	else
		{
		prevKfTime = key(myKfNum - 1).time//время предыдущего маркера
		prevKfValue = key(myKfNum - 1).value//значение предыдущего маркера
		if(time >= prevKfTime)//если мы в промежутке между нашим и предыдущим кейфреймами
			if(value instanceof Array)
				value.linear(prevKfValue,myKfOldValue,prevKfValue,myKfNewValue);//МАГИЯ
			else
				if(prevKfValue < myKfOldValue)
					linear(value,prevKfValue,myKfOldValue,prevKfValue,myKfNewValue);//МАГИЯ
				else
					linear(value,prevKfValue,myKfOldValue,myKfNewValue,prevKfValue);//МАГИЯ
		else //если мы до промежутка с измененной анимацией
			value;//ниче не делаем
		}
else //УЧАСТОК ПОСЛЕ НАШЕГО КЕЙФРЕЙМА
	if(myKfNum == numKeys)//если это последний кейфрейм
		myKfNewValue;//не анимируем
	else
		{
		nextKfTime = key(myKfNum+1).time;////время следующего маркера
		nextKfValue = key(myKfNum+1).value;//значение следующего маркера
		if(time<=nextKfTime)
			if(value instanceof Array)
				value.linear(myKfOldValue,nextKfValue,myKfNewValue,nextKfValue);//МАГИЯ
			else
				{
					if(myKfOldValue < nextKfValue)
						linear(value,myKfOldValue,nextKfValue,myKfNewValue,nextKfValue);//МАГИЯ
					else
						linear(value,myKfOldValue,nextKfValue,nextKfValue,myKfNewValue);//МАГИЯ
				}
		else value;
		}