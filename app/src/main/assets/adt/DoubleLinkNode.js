class DoubleLinkNode {
    constructor(){
        this.data = null;
        this.previous = null;
        this.next = null;
    }
    setPrevious(node){
        this.previous = node;
    }
    getPrevious(){
        return this.previous;
    }
    setNext(node){
        this.next = node;
    }
    getNext(){
        return this.next;
    }
    setData(data){
        this.data = data;
    }
    getData(){
        return this.data;
    }
}