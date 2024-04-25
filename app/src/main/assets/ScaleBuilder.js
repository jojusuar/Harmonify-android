function handleScale() {
    let scaleBtn = document.getElementById("scaleButton");
    let scaleCB = document.getElementById("scaleSelector");
    let modeCB = document.getElementById("modeSelector");
    let choiceIndex = scaleCB.selectedIndex;
    let choice = scaleCB[choiceIndex];
    let intervals = new Intervals(choice.value, 0);
    let modeString = '';
    for (let i = 0; i < intervals.modeArray.length; i++) {
        modeString += '<option value =' + i + '>' + intervals.modeArray[i] + '</option>';
    }
    modeCB.innerHTML = modeString;
}

function printScale() {
    clearOutput();
    let scaleBtn = document.getElementById("scaleButton");
    let scaleCB = document.getElementById("scaleSelector");
    let modeCB = document.getElementById("modeSelector");
    let choiceIndex = scaleCB.selectedIndex;
    let choice = scaleCB[choiceIndex];
    let modeIndex = modeCB.selectedIndex;
    let intervals = new Intervals(choice.value, modeIndex);
    let myScale = new Scale(new Note(noteValue, flat, sharp), intervals);

    let root = myScale.notes.reference.data;
    let top = new Note(root.symbol, root.flat, root.sharp, root.doubleFlat, root.doubleSharp);
    myScale.notes.add(top);
    let octave = 0;
    let startingPitch = root.getPitchClass();
    if (startingPitch < 5) {
        octave++;
    }
    let current = myScale.notes.reference;
    for (let i = 0; i < myScale.notes.size; i++) {
        let note = current.data;
        let currentPitch = note.getPitchClass();
        if (currentPitch < startingPitch) {
            octave++;
            startingPitch = currentPitch;
        }
        note.octave = octave;
        let button = document.createElement('button');
        button.classList.add("chord-button");
        let header = document.createElement("h1");
        header.textContent = note.toString();
        button.appendChild(header);
        divOutput.appendChild(button);
        button.addEventListener("click", function () {
            note.play(note.octave);
        });
        current = current.getNext();
    }
    top.octave = root.octave + 1;
}