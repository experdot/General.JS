import {
    Array2
} from "../../../../Engine/Collections/Array2";

export class ArrayGrid extends Array2 {
    offsetX: number[] = [0, -1, 0, 1, 1, 1, 0, -1, -1];
    offsetY: number[] = [0, -1, -1, -1, 0, 1, 1, 1, 0];

    constructor(w, h) {
        super(w, h);

        this.forEach((cell, x, y) => {
            this.data[x][y] = [];
        });
    }

    clear() {
        this.forEach(cell => {
            cell.splice(0, cell.length);
        });
    }

    neighbours(x, y) {
        const result = [];
        for (let i = 0; i < 9; i++) {
            let dx = x + this.offsetX[i];
            let dy = y + this.offsetY[i];
            if (dx >= 0 && dx < this.width && dy >= 0 && dy < this.height) {
                result.push(...this.data[dx][dy]);
            }
        }
        return result;
    }
}