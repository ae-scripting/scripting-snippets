var keyState = ScriptUI.environment.keyboardState; //снимаем положение всех клавиш клавиатуры на момент начала работы скрипта

function getRandomInt(min, max) { //создаем функцию, возвращающую рандомное значение между min и max
  return (Math.random() * (max - min)) + min; //функция Math.random() возвращает рандомное число между [0, 1)
}

app.beginUndoGroup("Random Speed And Influence"); //открываем группу отмены. Все, что делает скрипт, отменяется одним нажатием
  var curComp = app.project.activeItem; //текущая композиция
  var selProps = curComp.selectedProperties; //все выбранные свойства текущей композиции
  var speedRange = 1000; //максимальное значение скорости
  for (var i = 0; i < selProps.length; i++){
    if(selProps[i].propertyType === PropertyType.PROPERTY && selProps[i].selectedKeys.length > 0){ //если свойство не конечное (!= PropertyType.PROPERTY) или если у него нет выбранных ключей, мы пропускаем его
      var prop = selProps[i];
      for(var y = 0; y < prop.selectedKeys.length; y++){ //запускаем цикл по выбранным ключам конкретного свойства
        var influenceIn = getRandomInt(0.1, 100); //получаем рандомное значение influence
        var influenceOut = getRandomInt(0.1, 100);
        if (keyState.altKey){ //если при начале выполнения скрипта был зажат альт, берем рандомное значение и для inSpeed, и для outSpeed
          speedIn = getRandomInt(-speedRange, speedRange);
          speedOut = getRandomInt(-speedRange, speedRange);
        } else if (keyState.shiftKey){ //если при начале выполнения скрипта был зажат шифт, берем рандомное значение только для outSpeed
          speedIn = 0;
          speedOut = getRandomInt(-speedRange, speedRange);
        } else if (keyState.ctrlKey || keyState.metaKey){ //если при начале выполнения скрипта был зажат Control(win) или Command(mac), берем рандомное значение только для inSpeed
          speedIn = getRandomInt(-speedRange, speedRange);
          speedOut = 0;
        } else { //во всех других случаях outSpeed и inSpeed будут равны 0
          speedIn = 0;
          speedOut = 0;
        }
        var easeIn = new KeyframeEase(speedIn, influenceIn); //создаем два новых объекта KeyframeEase, встроенного в AE, отдельно для входящей Interpolation и исходящей
        var easeOut = new KeyframeEase(speedOut, influenceOut);
        if(! prop.isSpatial && (prop.value.length === 3)) { //если свойство не является пространственным (spatial) и его значение (value) представлено массивом из 3-х чисел
          prop.setTemporalEaseAtKey(prop.selectedKeys[y], [easeIn,easeIn,easeIn], [easeOut,easeOut,easeOut]); //назначаем ему временной изинг на выбранном ключе из массивов включающих 3 KeyframeEase объекта
        } else if(! prop.isSpatial && (prop.value.length === 2)) { //если свойство не является пространственным (spatial) и его значение (value) представлено массивом из 2-х чисел
          prop.setTemporalEaseAtKey(prop.selectedKeys[y], [easeIn,easeIn], [easeOut,easeOut]); //назначаем ему временной изинг на выбранном ключе из массивов включающих 2 KeyframeEase объекта
        } else { //если это пространственное свойство или если его значение представлено числом, 
          prop.setTemporalEaseAtKey(prop.selectedKeys[y], [easeIn], [easeOut]); //назначаем ему временной изинг на выбранном ключе из МАССИВОВ включающих 1 KeyframeEase объекта. 
          //prop.setTemporalEaseAtKey(prop.selectedKeys[y], easeIn, easeOut) - не выполнится, будет ошибка
        }
      }
    }
  }
	
app.endUndoGroup(); //закрываем группу отмены