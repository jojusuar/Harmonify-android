class Graph {
    constructor(isDirected) {
        this.isDirected = isDirected;
        this.edges = new Map();
        this.vertices = [];
    }

    isEmpty() {
        return this.vertices.length === 0;
    }

    addVertex(vertex) {
        this.vertices.push(vertex);
    }

    add(element) {
        let vertex = new Vertex(element);
        this.addVertex(vertex);
    }

    cartesianAddition(note) {
        this.add(note);
        for (let vertex of this.vertices) {
            let note2 = vertex.content;
            if (!note.equals(note2)) {
                this.connect(note, note2, getSemitoneDifference(note, note2));
                this.connect(note2, note, getSemitoneDifference(note2, note));
            }
        }
    }

    remove(element) {
        this.vertices = this.vertices.filter(item => !element.equals(item.content));
        for (let vertex2 of this.vertices) {
            vertex2.edges = vertex2.edges.filter(edge => !element.equals(edge.target.content));
        }
        for (let key of this.edges.keys()) {
            let collection = this.edges.get(key);
            this.edges.set(key, collection.filter(interval => !element.equals(interval.source.content) && !element.equals(interval.target.content)));
        }
    }

    connect(element1, element2, weight) {
        let vertex1 = null;
        let vertex2 = null;
        for (let vertex of this.vertices) {
            if (element1.equals(vertex.content)) {
                vertex1 = vertex;
            }
            else if (element2.equals(vertex.content)) {
                vertex2 = vertex;
            }
            if (vertex1 != null && vertex2 != null){
                break;
            }
        }
        if(vertex1 == null || vertex2 == null){
            return;
        }
        this.makeConnection(vertex1, vertex2, weight);
        if (!this.isDirected) {
            this.makeConnection(vertex2, vertex1, weight);
        }
    }

    makeConnection(source, target, weight) {
        let edge = new Edge(source, target, weight);
        source.edges.push(edge);
        if (!this.edges.has(weight)) {
            let array = [];
            this.edges.set(weight, array);
        }
        this.edges.get(weight).push(edge);
    }

    toString(){
        let string = '';
        for(let key of this.edges.keys()){
            let collection = this.edges.get(key);
            for(let interval of collection){
                string += 'interval: '+interval.source.content.toString()+'-'+interval.target.content.toString()+', '+interval.weight+' semitones <br>';
            }
        }
        return string;
    }
}