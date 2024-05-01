let divScaleFinder = document.getElementById('scaleFinderButtons');
let addButton = document.getElementById('addNoteButton2');
let deleteButton = document.getElementById('deleteNoteButton2');
deleteButton.style.display = 'none';
let noteRule = ["C", "D", "E", "F", "G", "A", "B"];
let circleRule = new CircularLinkedList();
let selectedButton;
let selectedNote;
circleRule.addAll(noteRule);
let rootNode = circleRule.getNode(selectedNotes[0]);

addButton.addEventListener('click', function () {
    clearWarning();
    clearOutput();
    let myNote = new Note(noteValue, flat, sharp, doubleFlat, doubleSharp);
    let duplicate = false;
    for (let note of selectedNotes) {
        let myNotePos;
        let currentPos;
        if (myNote.equals(note)) {
            myNotePos = 0;
            currentPos = 0;
        }
        for (let key of equivalencyMap.keys()) {
            if (myNotePos != undefined && currentPos != undefined) {
                break;
            }
            for (let element of equivalencyMap.get(key)) {
                if (element.equals(myNote)) {
                    myNotePos = parseInt(key);
                }
                else if (element.equals(note)) {
                    currentPos = parseInt(key);
                }
            }
        }
        if (myNotePos == currentPos) {
            duplicate = true;
            divWarning.innerHTML = '<h2>Another selected note already has that pitch class</h2>';
            break;
        }
    }
    if (!duplicate) {
        selectedNotes.push(myNote);
        sortNotes();
        normalizeRoot();
    }
    if (selectedNotes.length != 0) {
        deleteButton.style.display = 'inline-block';
        if (selectedNotes.length == 7) {
            let circle = new CircularLinkedList();
            circle.addAll(selectedNotes);
            divOutput.innerHTML = getMode(circle);
            if (selectedNotes.length > 6) {
                addButton.style.display = 'none';
            }
        }
        else {
            clearOutput();
        }
    }
    displayNotesAsButtons();
    showShiftModeButtons();
});

deleteButton.addEventListener("click", function () {
    if (selectedButton != undefined) {
        clearWarning();
        clearOutput();
        divNotes.removeChild(selectedButton);
        for (let i = 0; i < selectedNotes.length; i++) {
            if (selectedNotes[i].equals(selectedNote)) {
                selectedNotes.splice(i, 1);
                break;
            }
        }
        displayNotesAsButtons();
        showShiftModeButtons();
        selectedButton = undefined;
        selectedNote = undefined;
        circleRule.changeReferenceFromNode(rootNode);
    }
    if (selectedNotes.length == 0) {
            deleteButton.style.display = 'none';
    }
    else if (selectedNotes.length < 7) {
            addButton.style.display = 'inline-block';
    }
});

function sortNotes() {
    let root = selectedNotes[0];
    rootNode = circleRule.getNodeFromString(root.symbol);
    circleRule.changeReferenceFromNode(rootNode);
    let scaleRule = circleRule.toArray();
    selectedNotes.sort((a, b) => {
        let indexA;
        let indexB;
        for (let key of equivalencyMap.keys()) {
            if (indexA != undefined && indexB != undefined) {
                break;
            }
            let pitchClass = parseInt(key);
            for (let note of equivalencyMap.get(key)) {
                if (note.equals(a)) {
                    indexA = pitchClass;
                }
                if (note.equals(b)) {
                    indexB = pitchClass;
                }
            }
        }
        return indexA - indexB;
    });
    while (!root.equals(selectedNotes[0])) {
        selectedNotes.push(selectedNotes[0]);
        selectedNotes.splice(0, 1);
    }
}

function normalizeRoot() {
    let root = selectedNotes[0];
    if (root.doubleFlat || root.doubleSharp) {
        let equivalents = getEquivalents(root);
        for (let note of equivalents) {
            if (note.unaltered() || !(note.doubleFlat || note.doubleSharp)) {
                selectedNotes[0] = note;
                break;
            }
        }
    }
}

function displayNotesAsButtons() {
    divNotes.innerHTML = '';
    let octave = 1;
    let startingPitch = selectedNotes[0].getPitchClass();
    for (let note of selectedNotes) {
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
        divNotes.appendChild(button);
        button.addEventListener("click", function () {
            let allButtons = document.querySelectorAll('.chord-button');
            allButtons.forEach(button2 => {
                button2.style.backgroundColor = 'rgb(39, 40, 41)';
            });
            button.style.backgroundColor = 'rgb(70, 70, 70)';
            selectedButton = button;
            selectedNote = note;
            note.play(note.octave);
        });
        divNotes.style.display = 'block';
    }
}

function showShiftModeButtons() {
    let lineBreak = document.createElement('br');
    let nextMode = document.createElement("button");
    let previousMode = document.createElement("button");
    let nextH = document.createElement("h1");
    let previousH = document.createElement("h1");
    nextH.textContent = '→';
    previousH.textContent = '←';
    nextMode.appendChild(nextH);
    previousMode.appendChild(previousH);
    nextMode.classList.add("shift-button");
    previousMode.classList.add("shift-button");
    divNotes.appendChild(lineBreak);
    divNotes.appendChild(previousMode);
    divNotes.appendChild(nextMode);
    nextMode.addEventListener('click', function () {
        selectedNotes.push(selectedNotes[0]);
        selectedNotes.splice(0, 1);
        normalizeRoot();
        rootNode = circleRule.getNode(selectedNotes[0]);
        displayNotesAsButtons();
        showShiftModeButtons();
        if (selectedNotes.length == 7) {
            let circle = new CircularLinkedList();
            circle.addAll(selectedNotes);
            divOutput.innerHTML = getMode(circle);
        }
    });
    previousMode.addEventListener('click', function () {
        let temp = [selectedNotes[selectedNotes.length - 1]];
        temp.push(...selectedNotes.slice(0, selectedNotes.length - 1));
        selectedNotes = temp;
        normalizeRoot();
        rootNode = circleRule.getNode(selectedNotes[0]);
        displayNotesAsButtons();
        showShiftModeButtons();
        if (selectedNotes.length == 7) {
            let circle = new CircularLinkedList();
            circle.addAll(selectedNotes);
            divOutput.innerHTML = getMode(circle);
        }
    });
}

let modeMap = new Map();
modeMap.set(2212221, ['Ionian (major)', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian (minor)', 'Locrian']);
modeMap.set(2122221, ['Jazz minor', 'Dorian ♭2', 'Lydian augmented', 'Acoustic (Lydian dominant)', 'Aeolian dominant', 'Half-diminished', 'Altered dominant']);
modeMap.set(2212131, ['Ionian ♭6 (harmonic major)', 'Dorian ♭5', 'Phrygian ♭4', 'Lydian ♭3', 'Mixolydian ♭2', 'Lydian augmented ♯2', 'Locrian 𝄫7']);
modeMap.set(2122131, ['Aeolian ♯7 (harmonic minor)', 'Locrian ♮6', 'Ionian ♯5', 'Dorian ♯4', 'Phrygian dominant', 'Lydian ♯2', 'Super-Locrian']);
modeMap.set(1312131, ['Double harmonic major', 'Lydian ♯2 ♯6', 'Ultraphrygian', 'Gypsy minor', 'Oriental', 'Ionian ♯2 ♯5', 'Locrian 𝄫3 𝄫7']);
modeMap.set(1222221, ['Neapolitan major', 'Leading whole tone', 'Lydian augmented dominant', 'Lydian dominant ♭6', 'Major Locrian', 'Half-diminished ♭4 ', 'Altered dominant 𝄫3']);
modeMap.set(1222131, ['Neapolitan minor', 'Lydian ♯6', 'Mixolydian augmented', 'Romani minor', 'Locrian dominant', 'Ionian ♯2', 'Ultralocrian']);
modeMap.set(3121212, ['Hungarian major', 'Ultralocrian 𝄫6', 'Harmonic minor ♭5', 'Altered dominant ♮6', 'Jazz minor ♯5', 'Ukrainian Dorian ♭2', 'Lydian augmented ♯3']);
modeMap.set(1321212, ['Romanian major', 'Super-Lydian augmented ♮6', 'Locrian ♮2 𝄫7', 'Istrian (heptatonic)', 'Jazz minor ♭5', 'Javanese ♭4', 'Lydian augmented ♭3']);

function getMode(linkedList) {
    let mode = 0;
    let intervals = getIntervalList(linkedList);
    let identifier = parseNumber(intervals);
    while (mode < 7) {
        for (let key of modeMap.keys()) {
            let scaleID = parseInt(key);
            if (identifier == scaleID) {
                let modeName = modeMap.get(key)[mode];
                return '<h1>' + selectedNotes[0].toString() + ' ' + modeName + '</h1>';
            }
        }
        identifier = shiftNumber(identifier);
        mode++;
    }
    return '<br> No proper name found, but the algorithm suggests: <h1>' + makeItUp() + '</h1>';
}

function getIntervalList(linkedList) {
    let intervals = new CircularLinkedList();
    let current = linkedList.reference;
    for (let i = 0; i < linkedList.size; i++) {
        let currentNote = current.data;
        let nextNote = current.next.data;
        let distance = getSemitoneDifference(currentNote, nextNote);
        intervals.add(distance);
        current = current.next;
    }
    return intervals;
}

function parseNumber(linkedList) {
    let numberString = '';
    let current = linkedList.reference;
    for (let i = 0; i < linkedList.size; i++) {
        let step = current.data;
        numberString += step;
        current = current.next;
    }
    let parsedNumber = parseInt(numberString);
    return parsedNumber;
}

function shiftNumber(number) {
    let numberString = number.toString();
    let shiftedString = numberString[numberString.length - 1] + numberString.slice(0, -1);
    let shiftedNumber = parseInt(shiftedString);
    return shiftedNumber;
}

let greekMap = new Map();
greekMap.set(0, 'Ionian');
greekMap.set(1, 'Dorian');
greekMap.set(2, 'Phrygian');
greekMap.set(3, 'Lydian');
greekMap.set(4, 'Mixolydian');
greekMap.set(5, 'Aeolian');
greekMap.set(6, 'Locrian');

function makeItUp() {
    let closestScale = getClosest();
    let scaleName = selectedNotes[0].toString() + ' ' + greekMap.get(closestScale[1]);
    let scale = closestScale[0];
    let notes = scale.notes.toArray();
    for (let i = 1; i < notes.length; i++) {
        let current = notes[i];
        let difference = getSemitoneDifference(current, selectedNotes[i]);
        if (difference > 3) {
            difference += -12;
        }
        if (difference != 0) {
            let note = i + 1;
            if (current.flat) {   //somewhere in between here, if a triple accidental appears (else clauses), retry the comparison against scales with the equivalent of the root note as the starting point. 
                if (difference == -1) {
                    scaleName += ' 𝄫' + note;
                }
                else if (difference == 1) {
                    scaleName += ' ♮' + note;
                }
                else if (difference == 2) {
                    scaleName += ' ♯' + note;
                }
                else if (difference == 3) {
                    scaleName += ' 𝄪' + note;
                }
                else {
                    tryWithEquivalent();
                    return makeItUp();
                }
            }
            else if (!current.flat && !current.sharp) {
                if (difference == -2) {
                    scaleName += ' 𝄫' + note;
                }
                else if (difference == -1) {
                    scaleName += ' ♭' + note;
                }
                else if (difference == 1) {
                    scaleName += ' ♯' + note;
                }
                else if (difference == 2) {
                    scaleName += ' 𝄪' + note;
                }
                else {
                    tryWithEquivalent();
                    return makeItUp();
                }
            }
            else if (current.sharp) {
                if (difference == -3) {
                    scaleName += ' 𝄫' + note;
                }
                else if (difference == -2) {
                    scaleName += ' ♭' + note;
                }
                else if (difference == -1) {
                    scaleName += ' ♮' + note;
                }
                else if (difference == 1) {
                    scaleName += ' ♯' + note;
                }
                else {
                    tryWithEquivalent();
                    return makeItUp();
                }
            }
        }
    }
    return scaleName;
}

function tryWithEquivalent() {
    let equivalents = getEquivalents(selectedNotes[0]);
    selectedNotes[0] = equivalents[0];
}

function getClosest() {
    let scales = [new Scale(selectedNotes[0], new Intervals("DIATONIC", 0)), new Scale(selectedNotes[0], new Intervals("DIATONIC", 1)), new Scale(selectedNotes[0], new Intervals("DIATONIC", 2)), new Scale(selectedNotes[0], new Intervals("DIATONIC", 3)), new Scale(selectedNotes[0], new Intervals("DIATONIC", 4)), new Scale(selectedNotes[0], new Intervals("DIATONIC", 5)), new Scale(selectedNotes[0], new Intervals("DIATONIC", 6))]
    let mostCoincidences = 0;
    let closest;
    let index;
    for (let i = 0; i < scales.length; i++) {
        let scale = scales[i];
        let counter = 0;
        let notes = scale.notes.toArray();
        for (let j = 0; j < notes.length; j++) {
            if (notes[j].getPitchClass() == selectedNotes[j].getPitchClass()) {
                counter++;
            }
        }
        if (counter > mostCoincidences) {
            mostCoincidences = counter;
            closest = scale;
            index = i;
        }
    }
    return [closest, index];
}
