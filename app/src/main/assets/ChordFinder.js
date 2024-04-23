let divFinder = document.getElementById('finderButtons');
let divNotes = document.getElementById('selectedNotes');
let divWarning = document.getElementById('warning');
let addNoteButton = document.getElementById('addNoteButton');
let deleteNoteButton = document.getElementById('deleteNoteButton');
deleteNoteButton.style.display = 'none';
let selectedNotes = [];
let noteGraph = new Graph(true);

let foundChord = '<h1> *still cooking* </h1>';

function displaySelectedNotes() {
    let selectedNotesString = "<h2> Notes: </h2>";
    selectedNotes.forEach(note => {
        selectedNotesString = selectedNotesString.slice(0, selectedNotesString.length - 5) + ' •' + note.toString() + '  ' + '</h2>';
    });
    divNotes.innerHTML = selectedNotesString;
    divNotes.style.display = 'block';
}

function deleteNote() {
    noteGraph.remove(selectedNotes.pop());
}

function findChord() {
    let rule = ["C", "D", "E", "F", "G", "A", "B"];
    let pseudoScale = new CircularLinkedList();
    let selectedNotesCopy = [...selectedNotes];
    selectedNotesCopy.sort((a, b) => {
        let indexA;
        let indexB;
        for (let key of equivalencyMap.keys()) {
            if (indexA != undefined && indexB != undefined) {
                break;
            }
            for (let note of equivalencyMap.get(key)) {
                if (note.equals(a)) {
                    indexA = parseInt(key);
                    break;
                }
                else if (note.equals(b)) {
                    indexB = parseInt(key);
                    break;
                }
            }
        }
        return indexA - indexB;
    });
    pseudoScale.addAll(selectedNotesCopy);
    let dummy = new Scale();
    dummy.notes = pseudoScale;
    let possibleRoots = findPossibleRoots();
    divOutput.innerHTML += '<h2>Possible chords: </h2>';
    divOutput.innerHTML += 'Click on a chord to hear it and reveal its class set properties<br>';
    for (let root of possibleRoots) {
        let chord = new Chord(root, dummy, true, false);
        let button = document.createElement("button");
        button.classList.add("chord-button");
        let header = document.createElement("h1");
        header.textContent = chord.toString();
        button.appendChild(header);
        divOutput.appendChild(button);
        button.addEventListener("click", function () {
            if (divOutput.lastChild.tagName !== "BUTTON") {
                divOutput.removeChild(divOutput.lastChild);
                divOutput.removeChild(divOutput.lastChild);
                divOutput.removeChild(divOutput.lastChild);
                divOutput.removeChild(divOutput.lastChild);
            }
            chord.play(0);
            let vector = chord.getIntervalVector();
            let classSet = chord.getPitchClassSet()
            let normalOrder = getNormalOrder(classSet);
            let primeForm = getPrimeForm(normalOrder);
            let vectorH = document.createElement('h2');
            let classSetH = document.createElement('h2');
            let normalOrderH = document.createElement('h2');
            let primeFormH = document.createElement('h2');
            vectorH.textContent = 'Interval vector: '+vector;
            classSetH.textContent = 'Pitch class set: ['+classSet+']';
            normalOrderH.textContent = 'Normal order: ['+normalOrder+']';
            primeFormH.textContent = 'Prime form: ['+primeForm+']';
            divOutput.appendChild(vectorH);
            divOutput.appendChild(classSetH);
            divOutput.appendChild(normalOrderH);
            divOutput.appendChild(primeFormH);
        });
    }

    let chordButtons = document.querySelectorAll('.chord-button');
    chordButtons.forEach(button => {
        button.addEventListener('click', () => {

            chordButtons.forEach(btn => {
                btn.style.backgroundColor = 'rgb(39, 40, 41)';
            });
            button.classList.add('selected');
            button.style.backgroundColor = 'rgb(70, 70, 70)';
        });
    });
}

function findPossibleRoots() {
    let intervals = noteGraph.edges;
    let possibleRoots = [];
    if (intervals.has(7) && intervals.get(7).length > 0) {
        for (let interval of intervals.get(7)) {   // looking for perfect fifths
            possibleRoots.push(interval.source.content);
        }
    }
    else if ((intervals.has(6) && intervals.get(6).length > 0) || (intervals.has(8) && intervals.get(8).length > 0)) { //if perfect fifths don't appear, look for altered fifths
        if (intervals.has(6)) {
            for (let interval of intervals.get(6)) {
                possibleRoots.push(interval.source.content);
            }
        }
        if (intervals.has(8)) {
            for (let interval of intervals.get(8)) {
                let augmentedFifth = interval.target.content;
                if (intervals.has(3) && intervals.get(3).length > 0) { //if still nothing, triads can't be formed. proceed by searching for thirds
                    for (let interval2 of intervals.get(3)) {
                        if (augmentedFifth.equals(interval2.source.content)) {
                            possibleRoots.push(augmentedFifth); //A minor 3rd and augmented 5th triad is an inversion of a major triad where the 5th is the root
                        }
                    }
                }
                else {
                    possibleRoots.push(interval.source.content);
                }
            }
        }
    }
    else if ((intervals.has(3) && intervals.get(3).length > 0) || (intervals.has(4) && intervals.get(4).length > 0)) { //if still nothing, triads can't be formed. proceed by searching for thirds
        if (intervals.has(3)) {
            for (let interval of intervals.get(3)) {
                possibleRoots.push(interval.source.content);
            }
        }
        if (intervals.has(4)) {
            for (let interval of intervals.get(4)) {
                possibleRoots.push(interval.source.content);
            }
        }
    }
    else { // if not even thirds can be found, just pick the first note as root and calculate whatever the hell just got input'd
        possibleRoots.push(noteGraph.vertices[0].content);
    }
    possibleRoots = possibleRoots.reduce((accumulator, currentValue) => {
        if (!accumulator.includes(currentValue)) {
            accumulator.push(currentValue);
        }
        return accumulator;
    }, []);
    return possibleRoots;
}

function clearWarning() {
    while (divWarning.firstChild) {
        divWarning.removeChild(divWarning.firstChild);
    }
};

addNoteButton.addEventListener('click', function () {
    clearWarning();
    clearOutput();
    let myNote = new Note(noteValue, flat, sharp, doubleFlat, doubleSharp);
    let duplicate = false;
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
    if (!duplicate) {
        selectedNotes.push(myNote);
        noteGraph.cartesianAddition(myNote);
    }
    if (selectedNotes.length != 0) {
        deleteNoteButton.style.display = 'inline-block';
        if (selectedNotes.length > 2) {
            findChord();
            if (selectedNotes.length > 6) {
                addNoteButton.style.display = 'none';
            }
        }
        else {
            clearOutput();
        }
    }
    displaySelectedNotes();
});

deleteNoteButton.addEventListener('click', function () {
    clearWarning();
    clearOutput();
    deleteNote();
    displaySelectedNotes();
    if (selectedNotes.length > 2) {
        findChord();
    }
    else {
        clearOutput();
    }
    if (selectedNotes.length < 7) {
        addNoteButton.style.display = 'inline-block';
        if (selectedNotes.length == 0) {
            deleteNoteButton.style.display = 'none';
        }
    }
    displaySelectedNotes();
});

function showProperties(string) {
    // clearWarning();
    // clearOutput();
    // findChord();
    //divOutput.innerHTML += string;
}