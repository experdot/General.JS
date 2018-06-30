import {
    AnimationBox
} from "../../Engine/Game/Animation/AnimationBox";
import {
    ParticlesFlyerWorld
} from "../ParticlesFlyerWorld";
import {
    ParticlesWalkerWorld
} from "../ParticlesWalkerWorld";
import {
    ParticlesTreeWorld
} from "../ParticlesTreeWorld";
import {
    LSystemTreeWorld
} from "../LSystemTreeWorld";
import {
    GameOfLifeWorld
} from "../GameOfLifeWorld";
import {
    EndlessAbyssWorld
} from "../EndlessAbyssWorld";

class GameStarter {
    constructor() {
        this.symbols = {};
        this.addSymbol("flyer", ParticlesFlyerWorld);
        this.addSymbol("walker", ParticlesWalkerWorld);
        this.addSymbol("tree", ParticlesTreeWorld);
        this.addSymbol("lsystemtree", LSystemTreeWorld);
        this.addSymbol("gameoflife", GameOfLifeWorld);
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
    GameStarter
};