function handleScale() {
    let scaleBtn = document.getElementById("scaleButton");
    let scaleCB = document.getElementById("scaleSelector");
    let modeCB = document.getElementById("modeSelector");
    let choiceIndex = scaleCB.selectedIndex;
    let choice = scaleCB[choiceIndex];
    let intervals = new Intervals(choice.value, 0);
    let modeString = '';
    for(let i = 0; i < intervals.modeArray.length; i++){
        modeString += '<option value ='+i+'>'+intervals.modeArray[i]+'</option>';
    }
    modeCB.innerHTML = modeString;
}

function printScale() {
    let scaleBtn = document.getElementById("scaleButton");
    let scaleCB = document.getElementById("scaleSelector");
    let modeCB = document.getElementById("modeSelector");
    let choiceIndex = scaleCB.selectedIndex;
    let choice = scaleCB[choiceIndex];
    let modeIndex = modeCB.selectedIndex;
    let intervals = new Intervals(choice.value, modeIndex);
    let myScale = new Scale(new Note(noteValue, flat, sharp), intervals);
    divOutput.innerHTML = '<h1>' + myScale.toString() + '</h1>';
}