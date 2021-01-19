class Stack {
    elements = [];


    addElement(element) {
        this.elements.push(element);
    }

    stackLength() {
        console.log("Length of the stack: " + this.elements.length);
    }

    returnOnTopElement() {
        console.log(this.elements[this.elements.length - 1]);
        return this.elements[this.elements.length - 1];
    }

    displayElements() {
        console.log(this.elements);
    }

    displayElementsBackwards() {
        console.log(this.elements.reverse());
        this.elements.reverse();
    }
}

let stack = new Stack();
stack.addElement(5);
stack.stackLength();
stack.returnOnTopElement();

stack.addElement(10);
stack.stackLength();
stack.returnOnTopElement();

stack.displayElements();
stack.displayElementsBackwards();
stack.displayElements();