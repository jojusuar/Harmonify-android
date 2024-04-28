let divScaleFinder = document.getElementById('scaleFinderButtons');
let addButton = document.getElementById('addNoteButton2');
let deleteButton = document.getElementById('deleteNoteButton2');
deleteButton.style.display = 'none';
let noteRule = ["C", "D", "E", "F", "G", "A", "B"];
let circleRule = new CircularLinkedList();
circleRule.addAll(noteRule);

addButton.addEventListener('click', function () {
    clearWarning();
    clearOutput();
    let myNote = new Note(noteValue, flat, sharp, doubleFlat, doubleSharp);
    let duplicate = false;
    let inOrder = true;
    if (selectedNotes.length > 0) {
        let lastIndex = circleRule.indexOfString(selectedNotes[selectedNotes.length - 1].symbol);
        let lastNode = circleRule.getNode(lastIndex);
        let expected = lastNode.next.data;
        if (myNote.symbol != expected) {
            inOrder = false;
            divWarning.innerHTML = '<h2>Unexpected note! Please enter notes in order</h2>';
        }
    }
    for (let note of selectedNotes) {
        if (myNote.symbol === note.symbol) {
            duplicate = true;
            divWarning.innerHTML = '<h2>Another selected note already uses that symbol</h2>';
            break;
        }
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
    if (!duplicate && inOrder) {
        selectedNotes.push(myNote);
    }
    if (selectedNotes.length != 0) {
        deleteButton.style.display = 'inline-block';
        if (selectedNotes.length == 7) {
            let circle = new CircularLinkedList();
            circle.addAll(selectedNotes);
            divOutput.innerHTML = getMode(circle);
            if (selectedNotes.length > 6) {
                addNoteButton.style.display = 'none';
            }
        }
        else {
            clearOutput();
        }
    }
    displayNotesAsButtons();
});

deleteButton.addEventListener("click", function () {
    clearWarning();
    clearOutput();
    selectedNotes.pop();
    displayNotesAsButtons();
    if (selectedNotes.length == 0) {
        deleteButton.style.display = 'none';
    }
});

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
            note.play(note.octave);
        });
        divNotes.style.display = 'block';
    }
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
                return '<h1>'+selectedNotes[0].toString() + ' ' + modeName+'</h1>';
            }
        }
        identifier = shiftNumber(identifier);
        mode++;
    }
    return '<br> No proper name found, but the algorithm suggests: <h1>'+makeItUp(identifier)+'</h1>';
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
greekMap.set(2212221, ['Ionian', 0]);
greekMap.set(2122212, ['Dorian', 1]);
greekMap.set(1222122, ['Phrygian', 2]);
greekMap.set(2221221, ['Lydian', 3]);
greekMap.set(2212212, ['Mixolydian', 4]);
greekMap.set(2122122, ['Aeolian', 5]);
greekMap.set(1221222, ['Locrian', 6]);

function makeItUp(identifier) {
    let closestID = getClosest(identifier);
    let closest = greekMap.get(closestID);
    let scaleName = selectedNotes[0].toString() + ' ' + closest[0];
    let scale = new Scale(selectedNotes[0], new Intervals("DIATONIC", closest[1]));
    let notes = scale.notes.toArray();
    for (let i = 1; i < notes.length; i++) {
        let current = notes[i];
        let difference = getSemitoneDifference(current, selectedNotes[i]);
        if (difference > 3) {
            difference += -12;
        }
        if (difference != 0) {
            let note = i + 1;
            if (current.flat) {
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
                    scaleName += '?';
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
                    scaleName += '?';
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
                    scaleName += '?';
                }
            }
        }
    }
    return scaleName;
}

function getClosest(identifier) {
    let numString = identifier.toString();
    let coincidences = 0;
    let closest;
    for (let key of greekMap.keys()) {
        let modeID = String(key);
        let counter = 0;
        for (let i = 0; i < modeID.length; i++) {
            if (numString[i] == modeID[i]) {
                counter++;
            }
        }
        if (counter > coincidences) {
            coincidences = counter;
            closest = parseInt(key);
        }
    }
    return closest;
}