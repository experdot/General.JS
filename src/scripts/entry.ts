
import {
    AnimationBox
} from "./Engine/Core/GameAnimation/AnimationBox";
import {
    ParticlesTreeWorld
} from "./Gallery/ParticlesTreeWorld";
import {
    ParticlesWalkerWorld
} from "./Gallery/ParticlesWalkerWorld";
import {
    ParticlesFlyerWorld
} from "./Gallery/ParticlesFlyerWorld";
import {
    GameStarter
} from "./Gallery/GameStarter/GameStarter";


let natural2D = {
    AnimationBox: AnimationBox,
    ParticlesTreeWorld: ParticlesTreeWorld,
    ParticlesWalkerWorld: ParticlesWalkerWorld,
    ParticlesFlyerWorld: ParticlesFlyerWorld,
    GameStarter: GameStarter
};

(window as any).Natural2D = natural2D;