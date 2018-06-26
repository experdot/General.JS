import {
    Vector2
} from "../../../Fundamental/Vector";

class Inputs {
    constructor(world) {
        this.world = world;
        this.inputList = [];
    }

    launch(ui) {
        this.ui = ui;
        this.inputList.forEach(element => {
            this.regist(element);
        });
    }

    release() {
        this.inputList.forEach(element => {
            element.release();
        });
        this.ui = null;
    }

    regist(input) {
        input.regist(this);
    }

    addInput(input) {
        this.inputList.push(input);
    }
}

class InputBase {
    regist(inputs) {
        this.inputs = inputs;
        this.events = [];
    }
    registEventFast(sourceName, targetName, before, after) {
        let listener = (event) => {
            before && before(event);
            this.inputs.world.raiseSelfAndGameVisualsEvent(targetName, event);
            after && after(event);
        };
        this.inputs.ui.addEventListener(sourceName, listener);
        this.events.push({
            ui: this.inputs.ui,
            name: sourceName,
            listener: listener
        });
    }
    release() {
        this.events.forEach(event => {
            event.ui.removeEventListener(event.name, event.listener);
        });
    }
}

class MouseInput extends InputBase {
    regist(inputs) {
        super.regist(inputs);
        if (!inputs.mouse) {
            inputs.mouse = {
                isPressed: false,
                position: new Vector2(0, 0)
            };
        }
        this.registEventFast("click", "onClick");
        this.registEventFast("mouseenter", "onMouseEnter");
        this.registEventFast("mouseleave", "onMouseLeave");
        this.registEventFast("mousedown", "onMouseDown", () => {
            inputs.mouse.isPressed = true;
        });
        this.registEventFast("mouseup", "onMouseUp", () => {
            inputs.mouse.isPressed = false;
        });
        this.registEventFast("mousemove", "onMouseMove", event => {
            inputs.mouse.position = new Vector2(event.offsetX, event.offsetY);
        });

        // [Experimental Code]
        window.onmousewheel = document.onmousewheel = (event) => {
            inputs.world.raiseSelfAndGameVisualsEvent("onMouseWheel", event);
        };
    }
}

class TouchInput extends InputBase {
    regist(inputs) {
        super.regist(inputs);
        if (!inputs.touch) {
            inputs.touch = {
                isTouching: false,
                position: new Vector2(0, 0)
            };
        }
        this.registEventFast("touchStart", "onTouchStart", () => {
            inputs.touch.isTouching = true;
        });
        this.registEventFast("touchEnd", "onTouchEnd", () => {
            inputs.touch.isTouching = false;
        });

        // [Experimental Code]
        this.registEventFast("touchmove", "onTouchMove", event => {
            event.preventDefault();
            inputs.touch.position = new Vector2(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        });
    }
}

class PointerInput extends InputBase {
    regist(inputs) {
        super.regist(inputs);
        if (!inputs.pointer) {
            inputs.pointer = {
                isPressed: false,
                position: new Vector2(0, 0)
            };
        }

        this.registEventFast("mousedown", "onMouseDown", () => {
            inputs.pointer.isPressed = true;
        });
        this.registEventFast("mouseup", "onMouseUp", () => {
            inputs.pointer.isPressed = false;
        });
        this.registEventFast("mousemove", "onMouseMove", event => {
            inputs.pointer.position = new Vector2(event.offsetX, event.offsetY);
        });

        this.registEventFast("touchstart", "onTouchStart", () => {
            event.preventDefault();
            inputs.pointer.isPressed = true;
        });
        this.registEventFast("touchend", "onTouchEnd", () => {
            event.preventDefault();
            inputs.pointer.isPressed = false;
        });

        // [Experimental Code]
        this.registEventFast("touchmove", "onTouchMove", event => {
            event.preventDefault();
            inputs.pointer.isPressed = true;
            inputs.pointer.position = new Vector2(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        });

        this.registEventFast("mousedown", "onPointerPressed");
        this.registEventFast("mouseup", "onPointerReleased");
        this.registEventFast("mousemove", "onPointerMove");

        this.registEventFast("touchstart", "onPointerPressed");
        this.registEventFast("touchend", "onPointerReleased");
        this.registEventFast("touchmove", "onPointerMove");
    }
}

export {
    Inputs,
    InputBase,
    MouseInput,
    TouchInput,
    PointerInput
};