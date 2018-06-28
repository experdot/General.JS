import {
    Color
} from "../../../Engine/Fundamental/Color";

class Particle {
    constructor(location, size = 1, age = 0) {
        this.location = location;
        this.size = size;
        this.age = age;
        this.color = new Color(0, 0, 0, 1);
        this.isDead = false;
    }
}

export {
    Particle
};