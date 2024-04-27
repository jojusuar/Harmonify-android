class Note {
    constructor(symbol, flat, sharp, doubleFlat, doubleSharp) {
        this.symbol = symbol;
        this.flat = flat;
        this.sharp = sharp;
        this.doubleFlat = doubleFlat;
        this.doubleSharp = doubleSharp;
    }

    equals(element) {
        if (this == null || element == null) {
            return false;
        }
        if (this.toString() === element.toString()) {
            return true;
        }
    }

    unaltered() {
        return !this.flat && !this.sharp && !this.doubleFlat && !this.doubleSharp;
    }

    sameType(note) {
        return this.flat == note.flat && this.sharp == note.sharp && this.doubleFlat == note.doubleFlat && this.doubleSharp == note.doubleSharp;
    }

    toString() {
        let string = this.symbol;
        if (this.flat) {
            string += "♭";
        }
        else if (this.sharp) {
            string += "♯";
        }
        else if (this.doubleFlat) {
            string += "𝄫";
        }
        else if (this.doubleSharp) {
            string += "𝄪";
        }
        return string;
    }

    getPitchClass() {
        for (let key of equivalencyMap.keys()) {
            let pitch = parseInt(key)
            for (let element of equivalencyMap.get(key)) {
                if (this.equals(element)) {
                    return pitch;
                }
            }
        }
        return null;
    }

    play(octave) {
        let pitch = this.getPitchClass();
        let sound = audioMap.get(pitch)[octave];
        sound.play();
    }
}

let equivalencyMap = new Map(); //manually mapping the equivalences may seem hacky, but the overhead and code complexity caused by calculating them all back and forth wasn't worth it
equivalencyMap.set(0, [new Note("C", false, false, false, false), new Note("B", false, true, false, false), new Note("D", false, false, true, false)]);
equivalencyMap.set(1, [new Note("C", false, true, false, false), new Note("D", true, false, false, false), new Note("B", false, false, false, true)]);
equivalencyMap.set(2, [new Note("D", false, false, false, false), new Note("C", false, false, false, true), new Note("E", false, false, true, false)]);
equivalencyMap.set(3, [new Note("D", false, true, false, false), new Note("E", true, false, false, false), new Note("F", false, false, true, false)]);
equivalencyMap.set(4, [new Note("E", false, false, false, false), new Note("F", true, false, false, false), new Note("D", false, false, false, true)]);
equivalencyMap.set(5, [new Note("F", false, false, false, false), new Note("E", false, true, false, false), new Note("G", false, false, true, false)]);
equivalencyMap.set(6, [new Note("F", false, true, false, false), new Note("G", true, false, false, false), new Note("E", false, false, false, true)]);
equivalencyMap.set(7, [new Note("G", false, false, false, false), new Note("F", false, false, false, true), new Note("A", false, false, true, false)]);
equivalencyMap.set(8, [new Note("G", false, true, false, false), new Note("A", true, false, false, false)]);
equivalencyMap.set(9, [new Note("A", false, false, false, false), new Note("G", false, false, false, true), new Note("B", false, false, true, false)]);
equivalencyMap.set(10, [new Note("A", false, true, false, false), new Note("B", true, false, false, false), new Note("C", false, false, true, false)]);
equivalencyMap.set(11, [new Note("B", false, false, false, false), new Note("C", true, false, false, false), new Note("A", false, false, false, true)]);

// const audioSrc = "assets/audio/"; this will remain as legacy in case i ever want to add a piano soundfont again
// let pianoMap = new Map();
// pianoMap.set(0, [null, new Audio(audioSrc + "10.ogg"), new Audio(audioSrc + "20.ogg"), new Audio(audioSrc + "30.ogg"), new Audio(audioSrc + "40.ogg")]);
// pianoMap.set(1, [null, new Audio(audioSrc + "11.ogg"), new Audio(audioSrc + "21.ogg"), new Audio(audioSrc + "31.ogg"), new Audio(audioSrc + "41.ogg")]);
// pianoMap.set(2, [null, new Audio(audioSrc + "12.ogg"), new Audio(audioSrc + "22.ogg"), new Audio(audioSrc + "32.ogg"), new Audio(audioSrc + "42.ogg")]);
// pianoMap.set(3, [null, new Audio(audioSrc + "13.ogg"), new Audio(audioSrc + "23.ogg"), new Audio(audioSrc + "33.ogg"), new Audio(audioSrc + "43.ogg")]);
// pianoMap.set(4, [null, new Audio(audioSrc + "14.ogg"), new Audio(audioSrc + "24.ogg"), new Audio(audioSrc + "34.ogg"), new Audio(audioSrc + "44.ogg")]);
// pianoMap.set(5, [new Audio(audioSrc + "05.ogg"), new Audio(audioSrc + "15.ogg"), new Audio(audioSrc + "25.ogg"), new Audio(audioSrc + "35.ogg"), new Audio(audioSrc + "45.ogg")]);
// pianoMap.set(6, [new Audio(audioSrc + "06.ogg"), new Audio(audioSrc + "16.ogg"), new Audio(audioSrc + "26.ogg"), new Audio(audioSrc + "36.ogg"), null]);
// pianoMap.set(7, [new Audio(audioSrc + "07.ogg"), new Audio(audioSrc + "17.ogg"), new Audio(audioSrc + "27.ogg"), new Audio(audioSrc + "37.ogg"), null]);
// pianoMap.set(8, [new Audio(audioSrc + "08.ogg"), new Audio(audioSrc + "18.ogg"), new Audio(audioSrc + "28.ogg"), new Audio(audioSrc + "38.ogg"), null]);
// pianoMap.set(9, [new Audio(audioSrc + "09.ogg"), new Audio(audioSrc + "19.ogg"), new Audio(audioSrc + "29.ogg"), new Audio(audioSrc + "39.ogg"), null]);
// pianoMap.set(10, [new Audio(audioSrc + "0A.ogg"), new Audio(audioSrc + "1A.ogg"), new Audio(audioSrc + "2A.ogg"), new Audio(audioSrc + "3A.ogg"), null]);
// pianoMap.set(11, [new Audio(audioSrc + "0B.ogg"), new Audio(audioSrc + "1B.ogg"), new Audio(audioSrc + "2B.ogg"), new Audio(audioSrc + "3B.ogg"), null]);

const guitarSrc = "assets/guitar/";
let guitarMap = new Map();
guitarMap.set(0, [null, new Audio(guitarSrc + "G10.ogg"), new Audio(guitarSrc + "G20.ogg"), new Audio(guitarSrc + "G30.ogg"), new Audio(guitarSrc + "G40.ogg")]);
guitarMap.set(1, [null, new Audio(guitarSrc + "G11.ogg"), new Audio(guitarSrc + "G21.ogg"), new Audio(guitarSrc + "G31.ogg")]);
guitarMap.set(2, [null, new Audio(guitarSrc + "G12.ogg"), new Audio(guitarSrc + "G22.ogg"), new Audio(guitarSrc + "G32.ogg")]);
guitarMap.set(3, [null, new Audio(guitarSrc + "G13.ogg"), new Audio(guitarSrc + "G23.ogg"), new Audio(guitarSrc + "G33.ogg")]);
guitarMap.set(4, [new Audio(guitarSrc + "G04.ogg"), new Audio(guitarSrc + "G14.ogg"), new Audio(guitarSrc + "G24.ogg"), new Audio(guitarSrc + "G34.ogg")]);
guitarMap.set(5, [new Audio(guitarSrc + "G05.ogg"), new Audio(guitarSrc + "G15.ogg"), new Audio(guitarSrc + "G25.ogg"), new Audio(guitarSrc + "G35.ogg")]);
guitarMap.set(6, [new Audio(guitarSrc + "G06.ogg"), new Audio(guitarSrc + "G16.ogg"), new Audio(guitarSrc + "G26.ogg"), new Audio(guitarSrc + "G36.ogg")]);
guitarMap.set(7, [new Audio(guitarSrc + "G07.ogg"), new Audio(guitarSrc + "G17.ogg"), new Audio(guitarSrc + "G27.ogg"), new Audio(guitarSrc + "G37.ogg")]);
guitarMap.set(8, [new Audio(guitarSrc + "G08.ogg"), new Audio(guitarSrc + "G18.ogg"), new Audio(guitarSrc + "G28.ogg"), new Audio(guitarSrc + "G38.ogg")]);
guitarMap.set(9, [new Audio(guitarSrc + "G09.ogg"), new Audio(guitarSrc + "G19.ogg"), new Audio(guitarSrc + "G29.ogg"), new Audio(guitarSrc + "G39.ogg")]);
guitarMap.set(10, [new Audio(guitarSrc + "G0A.ogg"), new Audio(guitarSrc + "G1A.ogg"), new Audio(guitarSrc + "G2A.ogg"), new Audio(guitarSrc + "G3A.ogg")]);
guitarMap.set(11, [new Audio(guitarSrc + "G0B.ogg"), new Audio(guitarSrc + "G1B.ogg"), new Audio(guitarSrc + "G2B.ogg"), new Audio(guitarSrc + "G3B.ogg")]);

let audioMap = guitarMap;

function getSemitoneDifference(note1, note2) {
    let rule = ["C", "D", "E", "F", "G", "A", "B"];
    let circle = new CircularLinkedList();
    circle.addAll(rule);
    if (note1 == null || note2 == null) {
        return null;
    }
    let pos1;
    let pos2;
    let found1 = false;
    let found2 = false;
    for (let position of equivalencyMap.keys()) {
        if (found1 && found2) {
            break;
        }
        for (let note of equivalencyMap.get(position)) {
            if (!found1 && note1.equals(note)) {
                pos1 = parseInt(position);
                found1 = true;
            }
            if (!found2 && note2.equals(note)) {
                pos2 = parseInt(position);
                found2 = true;
            }
        }
    }
    let difference = pos2 - pos1;
    if (difference < 0) {
        difference = 12 + difference;
    }
    return difference;
}

function equivalents(note1) {
    for (let position of equivalencyMap.keys()) {
        for (let note2 of equivalencyMap.get(position)) {
            if (note1.equals(note2)) {
                return equivalencyMap.get(position).filter(element => !element.equals(note1));
            }
        }
    }
    return [];
}

function getNext(note, distance) {
    let rule = ["C", "D", "E", "F", "G", "A", "B"];
    let circle = new CircularLinkedList();
    circle.addAll(rule);
    if (distance > 4 || distance < 1) { //at most, a note can only have the next be 4 semitones apart to stick to the note rule
        return null;
    }
    let expectedNext;
    let current = circle.reference;
    for (let i = 0; i < circle.size; i++) {
        if (current.data == note.symbol) {
            expectedNext = current.getNext().data;
            break;
        }
        current = current.getNext();
    }
    for (let position of equivalencyMap.keys()) {
        for (let note2 of equivalencyMap.get(position)) {
            if (note.equals(note2)) {
                let position2 = parseInt(position) + distance;
                if (position2 > 11) {
                    position2 = position2 - 12;
                }
                for (let candidate of equivalencyMap.get(position2)) {
                    if (candidate.symbol == expectedNext) {
                        return candidate;
                    }
                }
                return null;
            }
        }
    }
    return null;
}

let intervalMap = new Map();
intervalMap.set(0, ["UNISON", "DOUBLY_DIMINISHED_SECOND"]);
intervalMap.set(1, ["DIMINISHED_SECOND", "DOUBLY_DIMINISHED_THIRD"]);
intervalMap.set(2, ["SECOND", "DIMINISHED_THIRD"]);
intervalMap.set(3, ["AUGMENTED_SECOND", "MINOR_THIRD", "DOUBLY_DIMINISHED_FOURTH"]);
intervalMap.set(4, ["DOUBLY_AUGMENTED_SECOND", "MAJOR_THIRD", "DIMINISHED_FOURTH"]);
intervalMap.set(5, ["AUGMENTED_THIRD", "FOURTH", "DOUBLY_DIMINISHED_FIFTH"]);
intervalMap.set(6, ["DOUBLY_AUGMENTED_THIRD", "AUGMENTED_FOURTH", "DIMINISHED_FIFTH", "DOUBLY_DIMINISHED_SIXTH"]);
intervalMap.set(7, ["DOUBLY_AUGMENTED_FOURTH", "FIFTH", "DIMINISHED_SIXTH"]);
intervalMap.set(8, ["AUGMENTED_FIFTH", "MINOR_SIXTH", "DOUBLY_DIMINISHED_SEVENTH"]);
intervalMap.set(9, ["DOUBLY_AUGMENTED_FIFTH", "MAJOR_SIXTH", "DIMINISHED_SEVENTH"]);
intervalMap.set(10, ["AUGMENTED_SIXTH", "MINOR_SEVENTH"]);
intervalMap.set(11, ["DOUBLY_AUGMENTED_SIXTH", "MAJOR_SEVENTH"]);

function getInterval(note1, note2) {
    let rule = ["C", "D", "E", "F", "G", "A", "B"];
    let circle = new CircularLinkedList();
    circle.addAll(rule);
    if (note1 == null || note2 == null || note1.symbol == note2.symbol) {
        return null;
    }
    let found1 = false;
    let counter = 0;
    let current = circle.reference;
    while (true) {
        if (found1) {
            counter++;
            if (current.data == note2.symbol) {
                break;
            }
        }
        else if (current.data == note1.symbol) {
            found1 = true;
        }
        current = current.getNext();
    }
    let expected;
    switch (counter) {
        case 1: {
            expected = "SECOND";
            break;
        }
        case 2: {
            expected = "THIRD";
            break;
        }
        case 3: {
            expected = "FOURTH";
            break;
        }
        case 4: {
            expected = "FIFTH";
            break;
        }
        case 5: {
            expected = "SIXTH";
            break;
        }
        case 6: {
            expected = "SEVENTH";
            break;
        }
    }
    let tonalDistance = getSemitoneDifference(note1, note2);
    for (let candidate of intervalMap.get(tonalDistance)) {
        if (candidate.includes(expected)) {
            return candidate;
        }
    }
    return null;
}