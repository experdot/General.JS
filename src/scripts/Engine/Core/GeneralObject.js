import {
    GeneralProcess
} from "./GeneralProcess";

/**
 * Represent a general object
 */
class GeneralObject {
    constructor() {
        this.start = new GeneralProcess(this);
        this.update = new GeneralProcess(this);
        this.dispose = new GeneralProcess(this);
        this.attachements = [];
    }

    proxy(action, sync = true) {
        let object = new GeneralObject();
        object.start.setContext(this);
        object.update.setContext(this);
        sync && this.sync(object);
        action && action(object, this);
        return object;
    }

    attach(object, sync = true) {
        this.attachements.push(object);
        sync && this.sync(object);
    }

    sync(object) {
        this.start.next(...args => object.start.process(...args));
        this.update.next(...args => object.update.process(...args));
        this.dispose.next(...args => object.dispose.process(...args));
    }
}

export {
    GeneralObject
};