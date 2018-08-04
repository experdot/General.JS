import { GeneralNode } from "../../Core/GeneralNode";
import { GameVisualInterface } from "../GameInterface/GameInterface";
import { Events } from "../../Common/Events";


export class GameVisual extends GeneralNode {

    events: Events;

    constructor() {
        super();
        this.implements(GameVisualInterface);
        this.events = new Events();
    }

    on(eventName: string, handler: Function, force = true) {
        this.events.addHandler(eventName, handler, force);
    }

    off(eventName: string, handler: Function) {
        this.events.removeHandler(eventName, handler);
    }

    dispatch(eventName: string, ...args: any[]) {
        this.events.raiseEvent(eventName, ...args);
        this.children.forEach(element => {
            (element as GameVisual).dispatch(eventName, ...args);
        });
    }

    dispose() {
        this.events.release();
    }
}