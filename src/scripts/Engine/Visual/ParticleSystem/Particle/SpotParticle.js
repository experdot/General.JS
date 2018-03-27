import {
    DynamicParticle
} from "./DynamicParticle";
import {
    Color
} from "../../../../Fundamental/Color";
import {
    Random
} from "../../../../Fundamental/Random";
import {
    Vector2
} from "../../../../Fundamental/Vector";

class SpotParticle extends DynamicParticle {
    constructor(location, size = 1, age = 0) {
        super(location, size, age);

        this.angleOffset = Math.random() * 0.03 - 0.015;
        this.velocityUpon = 16.0;
        this.random = new Random();

        this.sizeMinimum = 1.0;
        this.sizeRadius = 0.995;

        this.rotateRadius = 0.01;
        this.rotateRadiusRandom = 0.001;

        this.divideRadius = 0.03;
        this.divideSizeRadius = 0.80;
        this.divideSizeRadiusEx = 0.92;
        this.divideColorIncrement = 0.9;

    }

    update(particles, count) {
        if (this.age > 0) {
            this.age -= 1;
            this.size = this.size * this.sizeRadius;
            this.velocity = this.velocity.rotate(this.angleOffset * this.rotateRadius);
            this.velocity = this.velocity.rotate(this.random.nextNorm(-100, 100) * this.rotateRadiusRandom);
            this.color = this.getGradientColor(this.divideColorIncrement);
            this.velocityUpon = this.size * 0.38;
            this.move();
        }
        if (this.size > this.sizeMinimum) {
            if (Math.random() < this.divideRadius) {
                this.divide(particles, count);
            }
        } else {
            this.velocity = new Vector2(0, 0);
            this.isDead = true;
        }
    }

    divide(particles, count) {
        if (count < 2) {
            count = 2;
        }
        var newSize = this.size * this.divideSizeRadius;
        this.size = newSize;
        this.age = this.random.nextNorm(0, 30);
        this.angleOffset = Math.random() * 0.02 - 0.01;
        if (count > 1) {
            for (let i = 2; i <= count; i++) {
                newSize *= this.divideSizeRadiusEx;
                let particle = new SpotParticle(this.location, newSize);
                particle.velocity = this.velocity.rotate(this.random.next(-100, 100) * 0.011).multiply(0.618);
                particle.age = this.random.nextNorm(0, 40);
                particle.color = this.getDivideColor(this.divideColorIncrement);
                particles.push(particle);
            }
        }
    }

    getGradientColor(increment = 1) {
        const upon = 255;

        var r = this.color.r;
        r += increment;
        r = Math.min(upon, Math.max(0, r));

        var g = this.color.g;
        g += increment;
        g = Math.min(upon, Math.max(0, g));

        var b = this.color.b;
        b += increment;
        b = Math.min(upon, Math.max(0, b));

        return new Color(r, g, b);
    }

    getDivideColor(increment = 1) {
        const upon = 255;

        var r = this.color.r;
        var len = this.velocity.length() * 5;
        var half = len / 2;

        r += increment * (Math.random() * len - half);
        r = Math.min(upon, Math.max(0, r));

        var g = this.color.g;
        g += increment * (Math.random() * len - half);
        g = Math.min(upon, Math.max(0, g));

        var b = this.color.b;
        b += increment * (Math.random() * len - half);
        b = Math.min(upon, Math.max(0, b));

        return new Color(r, g, b);
    }
}

export {
    SpotParticle
};