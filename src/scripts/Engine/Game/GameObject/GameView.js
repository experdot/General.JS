import {
    GeneralObject
} from "../../Core/GeneralObject";
import {
    GameViewInterface
} from "../GameInterface/GameInterface";

/** 
 * Represents a view to present the visual object
 */
class GameView extends GeneralObject {
    constructor() {
        super();
        this.implements(GameViewInterface);
    }
}

export {
    GameView
};