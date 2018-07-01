import {
    GameView
} from "../GameObject/GameView";
import {
    Colors
} from "../../../Engine/UI/Color";

class GameWorldView extends GameView {
    constructor(target) {
        super(target);
        this.isClear = false;
        this.clearColor = Colors.Black;
    }

    draw(source, context) {
        if (this.isClear) {
            context.fillStyle = this.clearColor.rgba;
            context.fillRect(0, 0, this.target.width, this.target.height);
        }

        this.target.gameVisuals.forEach(element => {
            element.view && element.view.render.process(context);
        });
    }
}

export {
    GameWorldView
};