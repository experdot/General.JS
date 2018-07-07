import {
    GameVisual
} from "../../../../Engine/Game/GameObject/GameVisual";
import {
    GhostEffect
} from "../../../../Engine/Game/GameComponents/Effect/Effect";
import {
    Color,
    Colors
} from "../../../../Engine/UI/Color";
import {
    CellularAutomata
} from "../CellularAutomata";
import {
    Vector2
} from "../../../../Engine/Numerics/Vector2";
import {
    Cell
} from "../Cell";
import {
    GameView
} from "../../../../Engine/Game/GameObject/GameView";

class GameOfLife extends GameVisual {
    constructor(view) {
        super(view);
        this.start.next(this._start);
        this.update.next(this._update);

        this.offsetX = [-1, 0, 1, 1, 1, 0, -1, -1];
        this.offsetY = [-1, -1, -1, 0, 1, 1, 1, 0];

        this.proxy(new GhostEffect(new Color(0, 128, 128, 0.5), 10));
    }

    _start() {
        let w = this.world.width;
        let h = this.world.height;

        this.cellSize = 6;

        let cx = Math.round(w / this.cellSize);
        let cy = Math.round(h / this.cellSize);
        this.CA = new CellularAutomata(cx, cy);

        this.CA.forEach((cell, x, y) => {
            if (Math.random() > 0.9) {
                this._addDefaultCell(this.CA, x, y);
            }
        });

        this.cellColor = new Color(255, 255, 255, 1);

        this._bindEvents();

        this.tick = 0;
    }
    _update() {
        this.tick += 1;
        if (this.tick % 6 !== 0) {
            return;
        }
        this._generate();
    }

    _bindEvents() {
        this.on("PointerMoved", () => {
            if (this.world.inputs.pointer.isPressed) {
                let p = this.world.inputs.pointer.position;
                let x = Math.round(p.x / this.cellSize);
                let y = Math.round(p.y / this.cellSize);
                for (let i = 0; i < 4; i++) {
                    let dx = x + Math.round(Math.random() * 2 - 1);
                    let dy = y + Math.round(Math.random() * 2 - 1);
                    this._addDefaultCell(this.CA, dx, dy);
                }
            }
        });
    }

    _generate() {
        let generation = this.CA.generate();
        this.CA.forEach((cell, x, y) => {
            let count = this.CA.around(x, y, this.offsetX, this.offsetY);
            if (cell) {
                if (count === 2 || count === 3) {
                    let cell = this.CA.getCell(x, y);
                    generation.setCell(x, y, cell);
                }
            } else {
                if (count === 3) {
                    this._addDefaultCell(generation, x, y);
                }
            }
        });
        this.CA = generation;
    }
    _addDefaultCell(ca, x, y, color = Colors.White) {
        let location = new Vector2(x * this.cellSize, y * this.cellSize);
        ca.setCell(x, y, new Cell()).setLocation(location).setColor(color).setSize(this.cellSize);
    }
}

class GameOfLifeView extends GameView {
    draw(source, context) {
        this.target.CA.forEach(cell => {
            if (cell) {
                let p = cell.location;
                context.fillStyle = cell.color.rgba;
                context.fillRect(p.x, p.y, cell.size, cell.size);
            }
        });
    }
}

export {
    GameOfLife,
    GameOfLifeView
};