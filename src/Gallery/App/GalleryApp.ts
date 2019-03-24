import { App } from "../../Engine/Application/AppObject/App";
import { GalleryTextResourceManager, GalleryTexts } from "../Resources/GalleryTexts";
import { GalleryNavigator } from "./Navigator/GalleryNavigator";
import { GalleryImageResourceManager } from "../Resources/GalleryImages";
import { GalleryGame } from "./Game/GalleryGame";
import { AttachAlert } from "./Alert/AttachAlert";
import { WarningOpenOnPC } from "./Alert/WarningOpenOnPC";
import { ProgressCover } from "./Progress/ProgressCover";

export class GalleryApp extends App {
    constructor() {
        super();
        this.joint(new AttachAlert());
        this.joint(new GalleryNavigator());
        this.joint(new WarningOpenOnPC());
        this.joint(new ProgressCover);
        this.joint(new GalleryGame());
    }

    load() {
        GalleryTextResourceManager.load(() => {
            GalleryImageResourceManager.load(() => {
                this.processes.start.process();
            });
        });
    }
}

