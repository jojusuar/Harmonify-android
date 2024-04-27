let divFinder = document.getElementById('finderButtons');
let divNotes = document.getElementById('selectedNotes');
let divWarning = document.getElementById('warning');
let addNoteButton = document.getElementById('addNoteButton');
let deleteNoteButton = document.getElementById('deleteNoteButton');
deleteNoteButton.style.display = 'none';
let selectedNotes = [];
let noteGraph = new Graph(true);
let strict = false;

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
    possibleRoots.sort((a, b) => {
        let indexA;
        let indexB;
        for (let i = 0; i < selectedNotes.length; i++) {
            if (indexA != undefined && indexB != undefined) {
                break;
            }
            if (a.equals(selectedNotes[i])) {
                indexA = i;
            }
            if (b.equals(selectedNotes[i])) {
                indexB = i;
            }
        }
        return indexA - indexB;
    });
    divOutput.innerHTML += '<h2>Possible chords: </h2>';
    divOutput.innerHTML += 'Click on a chord to hear it and reveal its class set properties<br>';
    for (let root of possibleRoots) {
        let chord = new Chord(root, dummy, true, false);
        let button = document.createElement("button");
        button.classList.add("chord-button");
        let header = document.createElement("h1");
        header.textContent = chord.toString();
        if (!chord.components[0].equals(selectedNotes[0])) {
            header.textContent = chord.toString() + '/' + selectedNotes[0].toString();
        }
        button.appendChild(header);
        divOutput.appendChild(button);
        button.addEventListener("click", function () {
            clearWarning();
            if (divOutput.lastChild.tagName !== "BUTTON") {
                divOutput.removeChild(divOutput.lastChild);
                divOutput.removeChild(divOutput.lastChild);
                divOutput.removeChild(divOutput.lastChild);
                divOutput.removeChild(divOutput.lastChild);
            }
            if(chord.components[0].getPitchClass() < 7){ 
                chord.play(1);
            }
            else{
                chord.play(0);   
            }
            
            let vector = chord.getIntervalVector();
            let classSet = chord.getPitchClassSet()
            let normalOrder = getNormalOrder(classSet);
            let primeForm = getPrimeForm(normalOrder);
            let vectorH = document.createElement('h2');
            let classSetH = document.createElement('h2');
            let normalOrderH = document.createElement('h2');
            let primeFormH = document.createElement('h2');
            vectorH.textContent = 'Interval vector: ' + vector;
            classSetH.textContent = 'Pitch class set: [' + classSet + ']';
            normalOrderH.textContent = 'Normal order: [' + normalOrder + ']';
            primeFormH.textContent = 'Prime form: [' + primeForm + ']';
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
    let with3rd = [];
    if (strict) {
        possibleRoots.push(noteGraph.vertices[0].content);
        return possibleRoots;
    }
    if (intervals.has(3) && intervals.get(3).length > 0) {
        for (let interval of intervals.get(3)) {
            with3rd.push(interval.source.content);
        }
    }
    if (intervals.has(4) && intervals.get(4).length > 0) {
        for (let interval of intervals.get(4)) {
            with3rd.push(interval.source.content);
        }
    }
    let with7th = [];
    if (intervals.has(10) && intervals.get(10).length > 0) {
        for (let interval of intervals.get(10)) {
            with7th.push(interval.source.content);
        }
    }
    if (intervals.has(11) && intervals.get(11).length > 0) {
        for (let interval of intervals.get(11)) {
            with7th.push(interval.source.content);
        }
    }
    for (let note1 of with3rd) {  //the point is looking for notes that can form at least a 3rd and a 7th
        for (let note2 of with7th) {
            if (note1.equals(note2)) {
                possibleRoots.push(note1);
            }
        }
    }
    if (possibleRoots.length == 0) {
        if (intervals.has(7) && intervals.get(7).length > 0) {
            for (let interval of intervals.get(7)) {   // if no note can do that, look for fifths
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
                    if (intervals.has(3) && intervals.get(3).length > 0) {
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
        else if (with3rd.length > 0) { //if still nothing, triads can't be formed. proceed by searching for thirds
            possibleRoots.push(...with3rd);
        }
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

function toggleStrict() {
    strict = !strict;
    if (selectedNotes.length > 2) {
        clearWarning();
        clearOutput();
        findChord();
    }
}