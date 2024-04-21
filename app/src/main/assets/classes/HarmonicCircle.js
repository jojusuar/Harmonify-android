class HarmonicCircle {
    constructor(scale, allTensions, availableTensions) {
        let chords = new CircularLinkedList();
        let current = scale.notes.reference;
        let stop = current;
        chords.add(new Chord(current.getData(), scale, allTensions, availableTensions));
        current = current.getNext();
        while (current !== stop) {
            chords.add(new Chord(current.getData(), scale, allTensions, availableTensions));
            current = current.getNext();
        }
        this.chords = chords;
    }

    toString() {
        let string = "";
        let current = this.chords.reference;
        let stop = current;
        string += current.getData().toString();
        current = current.getNext();
        while (current !== stop) {
            string += " - " + current.getData().toString();
            current = current.getNext();
        }
        return string;
    }
}