import {
    ParticlesBase
} from "../ParticleSystem";
import {
    Random
} from "../../../../Engine/Numerics/Random";
import {
    GhostEffect
} from "../../../../Engine/Game/GameComponents/Effect/Effect";
import {
    Color,
    Colors
} from "../../../../Engine/UI/Color";
import {
    Vector2
} from "../../../../Engine/Numerics/Vector2";
import {
    ArrayGrid
} from "./ArrayGrid";
import {
    GameView
} from "../../../../Engine/Game/GameObject/GameView";
import {
    Graphics
} from "../../../../Engine/Drawing/Graphics";
import {
    FlyerParticle
} from "../Particle/FlyerParticle";

class ParticlesFlyer extends ParticlesBase {
    constructor(view) {
        super(view);
        this.random = new Random();
        this.joint(new GhostEffect(new Color(0, 0, 0, 0.01), 5));
    }

    start() {
        let w = this.world.width;
        let h = this.world.height;
        let center = new Vector2(w * 0.5, h * 0.5);
        this.flyers = [];

        const screen = new Vector2(w, h).length();
        const flyersCount = parseInt(screen / 16);
        const maxSize = parseInt(screen / 60);
        const fieldWidth = w * 0.8;
        const fieldHeight = h * 0.8;
        for (let i = 0; i < flyersCount; i++) {
            let particle = new FlyerParticle();
            particle.location = center.add(new Vector2(fieldWidth * Math.random() - fieldWidth / 2, fieldHeight * Math.random() - fieldHeight / 2));
            particle.velocity = new Vector2(10 * Math.random() - 5, 10 * Math.random() - 5);
            particle.size = 2 + maxSize * Math.random();
            particle.color = Colors.Gray;
            this.flyers.push(particle);
        }

        this.particles = this.flyers;

        this.revolution = 20;
        this.grid = this.createGrid(w, h, this.revolution);

        if (this.world.inputs.pointer.position.length() === 0) {
            this.world.inputs.pointer.position = new Vector2(w / 2, h / 2);
        }
    }

    update() {
        const rect = {
            width: this.world.width,
            height: this.world.height
        };

        this.grid.clear();
        this.allocateGrid(this.grid, this.particles, this.revolution);

        this.grid.forEach((cell, x, y) => {
            if (cell.length > 0) {
                let neighbours = this.grid.neighbours(x, y);
                cell.forEach(particle => {
                    particle.update(neighbours, rect, this.world.inputs.pointer.position);
                });
            }
        });
    }

    createGrid(width, height, revolution = 10) {
        let w = Math.ceil(width / revolution);
        let h = Math.ceil(height / revolution);
        return new ArrayGrid(w, h);
    }

    allocateGrid(grid, particles, revolution = 10) {
        particles.forEach(element => {
            let location = this.mapLocation(element.location, revolution);
            grid.get(location.x, location.y).push(element);
        });
    }

    mapLocation(location, revolution) {
        let x = Math.floor(location.x / revolution);
        let y = Math.floor(location.y / revolution);
        return new Vector2(x, y);
    }
}

class ParticlesFlyerView extends GameView {
    constructor() {
        super();
        this.rotation = 0;
    }

    render(source, context) {
        Graphics.offsetScale(context, -1, -1, 1);
        for (let index = 0; index < source.particles.length; index++) {
            const element = source.particles[index];
            let p = element.location;
            context.beginPath();
            context.arc(p.x, p.y, element.size / 2, 0, Math.PI * 2, false);
            context.closePath();
            context.fillStyle = element.color.rgba;
            context.fill();
        }
    }
}


export {
    ParticlesFlyer,
    ParticlesFlyerView
};