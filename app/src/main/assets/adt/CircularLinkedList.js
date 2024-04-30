class CircularLinkedList {
    constructor() {
        this.reference = new DoubleLinkNode();
        this.size = 0;
    }

    isEmpty() {
        return this.reference.data === null;
    }

    add(content) {
        if (this.isEmpty()) {
            this.reference.setData(content);
            this.reference.setNext(this.reference);
            this.reference.setPrevious(this.reference);
        } else {
            let temp = new DoubleLinkNode();
            temp.setData(content);
            temp.setNext(this.reference);
            temp.setPrevious(this.reference.previous);
            this.reference.previous.setNext(temp);
            this.reference.setPrevious(temp);
        }
        this.size++;
    }

    addAll(elements) {
        elements.forEach(element => {
            this.add(element);
        });
    }

    get(index) {
        let temp = this.reference;
        for (let i = 0; i < index; i++) {
            temp = temp.getNext();
        }
        return temp.getData();
    }

    getNode(index) {
        let temp = this.reference;
        for (let i = 0; i < index; i++) {
            temp = temp.getNext();
        }
        return temp;
    }

    getNodeFromObject(object) {
        let current = this.reference;
        for (let i = 0; i < this.size; i++) {
            let object2 = current.data;
            if (object2.equals(object)) {
                return current;
            }
            current = current.next;
        }
        return null;
    }

    getNodeFromString(string) {
        let current = this.reference;
        for (let i = 0; i < this.size; i++) {
            if (current.data.localeCompare(string) == 0) {
                return current;
            }
            current = current.next;
        }
        return null;
    }

    changeReference(index) {
        this.reference = this.getNode(index);
    }

    changeReferenceFromNode(node) {
        this.reference = node;
    }

    toString() {
        let string = "";
        let start = this.reference;
        string += start.getData().toString();
        start = start.getNext();
        while (start !== this.reference) {
            if (start.getData() === null) {
                string += " - null";
            }
            else {
                string += " - " + start.getData().toString();
            }
            start = start.getNext();
        }
        return string;
    }

    indexOfObject(element) {
        let index = 0;
        let temp = this.reference;
        if (temp.data.equals(element)) {
            return index;
        }
        temp = this.reference.getNext();
        index++;
        while (temp !== this.reference) {
            let current = temp.getData();
            if (current != null && current.equals(element)) {
                return index;
            }
            temp = temp.getNext();
            index++;
        }
        return -1;
    }

    indexOfString(element) {
        let index = 0;
        let temp = this.reference;
        if (temp.getData().localeCompare(element) == 0) {
            return index;
        }
        temp = this.reference.getNext();
        index++;
        while (temp !== this.reference) {
            if (temp.getData().localeCompare(element) == 0) {
                return index;
            }
            temp = temp.getNext();
            index++;
        }
        return -1;
    }

    replace(target, element) {
        let temp = this.reference;
        if (temp.getData().equals(target)) {
            temp.setData(element);
            return;
        }
        temp = this.reference.getNext();
        while (temp !== this.reference) {
            if (temp.getData().equals(target)) {
                temp.setData(element);
                return;
            }
            temp = temp.getNext();
        }
    }

    toArray() {
        let array = [];
        let current = this.reference;
        for (let i = 0; i < this.size; i++) {
            array.push(current.getData());
            current = current.getNext();
        }
        return array;
    }
}