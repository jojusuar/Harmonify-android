class Scale {
    constructor(root, intervals) {
        if (root == undefined) {
            this.notes = null;
        }
        else {
            let notes = [root];
            for (let interval of intervals.intervalArray) {
                notes.push(getNext(notes[notes.length - 1], interval));
            }
            let notesCircle = new CircularLinkedList();
            notesCircle.addAll(notes);
            this.notes = notesCircle;
        }
    }

    toString() {
        let current = this.notes.reference;
        let string = current.data.toString();
        current = current.getNext();
        for (let i = 1; i < this.notes.size; i++) {
            string += ' - ' + current.data.toString();
            current = current.getNext();
        }
        return string;
    }
}