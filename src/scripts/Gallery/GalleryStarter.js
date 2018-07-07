import {
    AnimationBox
} from "../Engine/Game/Animation/AnimationBox";
import {
    ParticlesFlyerWorld
} from "./Visuals/ParticlesFlyerWorld";
import {
    ParticlesWalkerWorld
} from "./Visuals/ParticlesWalkerWorld";
import {
    ParticlesTreeWorld
} from "./Visuals/ParticlesTreeWorld";
import {
    LSystemTreeWorld
} from "./Visuals/LSystemTreeWorld";
import {
    GameOfLifeWorld
} from "./Visuals/GameOfLifeWorld";
import {
    AudioVisualizerWorld
} from "./Visuals/AudioVisualizerWorld";
import {
    EndlessAbyssWorld
} from "./Games/EndlessAbyssWorld";

class GalleryStarter {
    constructor() {
        this.symbols = {};
        this.addSymbol("flyer", ParticlesFlyerWorld);
        this.addSymbol("walker", ParticlesWalkerWorld);
        this.addSymbol("tree", ParticlesTreeWorld);
        this.addSymbol("lsystemtree", LSystemTreeWorld);
        this.addSymbol("gameoflife", GameOfLifeWorld);
        this.addSymbol("audiovisualizer", AudioVisualizerWorld);
        this.addSymbol("endlessabyss", EndlessAbyssWorld);
    }

    addSymbol(name, symbol) {
        this.symbols[name] = symbol;
    }
    getSymbolByName(name) {
        return this.symbols[name];
    }
    launch(canvas) {
        let request = this._getRequest();
        let World = this.getSymbolByName(request["scene"]);
        if (World) {
            document.title = World.Title;
            return new AnimationBox(canvas, new World(canvas.width, canvas.height));
        } else {
            window.location = "../";
        }
    }

    _getRequest() {
        let result = {};
        let search = location.search;
        if (search.indexOf("?") >= 0) {
            let str = search.substr(1);
            let pairs = str.split("&");
            for (var i = 0; i < pairs.length; i++) {
                result[pairs[i].split("=")[0]] = unescape(pairs[i].split("=")[1]);
            }
        }
        return result;
    }
}
export {
    GalleryStarter
};