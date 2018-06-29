import {
    Color
} from "../../../../../Engine/UI/Color";
import {
    Vector2
} from "../../../../../Engine/Numerics/Vector2";
import {
    Random
} from "../../../../../Engine/Numerics/Random";
import {
    ParticlesBase
} from "../ParticleSystem";
import {
    SpotParticle
} from "../Particle/SpotParticle";

class ParticlesTree extends ParticlesBase {
    constructor(view) {
        super(view);
        this.spots = [];
        this.random = new Random();
        this.start.next(this._start);
        this.update.next(this._update);
    }

    _start() {
        var minLength = Math.min(this.world.width, this.world.height);
        var ratio = minLength / 2500 * Math.log10(minLength);
        var center = new Vector2(this.world.width / 2, this.world.height * 1.45);
        var root = new SpotParticle(center);
        root.velocity = new Vector2(0, -16 * ratio);
        root.size = 256 * ratio;
        root.age = 30;
        root.color = new Color(10, 10, 10);
        this.spots.push(root);
        this.particles = this.spots;
    }

    _update() {
        if (this.stopDraw) {
            return;
        }

        if (this.spots.length > 60000) {
            this.stopDraw = true;
            return;
        }
        if (this.spots.length > 0) {
            for (let index = 0; index < this.spots.length; index++) {
                const element = this.particles[index];
                element.update(this.spots, parseInt(this.random.normal(1, 3)));
            }
            this.killDead(this.spots);
        }
    }
}

export {
    ParticlesTree
};