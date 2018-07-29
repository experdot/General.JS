import {
    GameWorld
} from "../../Engine/Game/GameWorld/GameWorld";
import {
    PointerInput,
    KeyInput
} from "../../Engine/Common/Inputs";
import {
    EndlessAbyss,
    EndlessAbyssView
} from "./EndlessAbyss/EndlessAbyss";
import {
    VisualPointer
} from "../Visuals/VisualPointer/VisualPointer";
import {
    GalleryResources
} from "../Resources/GalleryResource";

class EndlessAbyssWorld extends GameWorld {
    static get Title() {
        return GalleryResources.EndlessAbyssWorld.Title;
    }

    initialize() {
        this.inputs.addInput(new PointerInput());
        this.inputs.addInput(new KeyInput());
    }

    createObjects() {
        this.addChild(new EndlessAbyss().joint(new EndlessAbyssView()));
        this.joint(new VisualPointer());
    }
}

export {
    EndlessAbyssWorld
};