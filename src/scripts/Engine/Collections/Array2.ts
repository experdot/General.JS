class Array2 {
    private width: number;
    private height: number;
    private data: any[];

    constructor(width: number = 1, height: number = 1) {
        this.width = width;
        this.height = height;
        this.data = [];
        for (let x = 0; x < width; x++) {
            this.data.push([]);
            for (let y = 0; y < height; y++) {
                this.data[x][y] = undefined;
            }
        }
    }

    set(x: number, y: number, value: any) {
        this.data[x][y] = value;
        return this.data[x][y];
    }

    get(x: number, y: number) {
        return this.data[x][y];
    }

    forEach(action: { (value: any, x: number, y: number): number }) {
        this.data.forEach((column, x) => {
            column && column.forEach((value, y) => {
                action && action(value, x, y);
            });
        });
    }
}

export {
    Array2
};