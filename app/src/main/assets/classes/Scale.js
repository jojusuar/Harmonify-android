class Scale {
    constructor(root, intervals) {
        if (root == undefined) {
            this.notes = null;
        }
        else {
            let notes = [root];
            let tryAgain = false;
            for (let interval of intervals.intervalArray) {
                let nextNote = getNext(notes[notes.length - 1], interval);
                if (nextNote != null) {
                    notes.push(nextNote);
                }
                else {
                    tryAgain = true;
                    break;
                }
            }
            if (tryAgain) {
                let equivalents = getEquivalents(root);
                for (let equivalent of equivalents) {
                    if(notes.length == 7){
                        break;
                    }
                    notes = [equivalent];
                    for (let interval of intervals.intervalArray) {
                        let nextNote = getNext(notes[notes.length - 1], interval);
                        if (nextNote != null) {
                            notes.push(nextNote);
                        }
                        else {
                            break;
                        }
                    }
                }
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