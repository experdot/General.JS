import {
    OffsetMap
} from "./OffsetMap/OffsetMap";
import {
    Block
} from "./Block/Block";
import {
    Vector2
} from "../../../../Engine/Numerics/Vector2";
import {
    Colors, Color
} from "../../../../Engine/UI/Color";

class BlockGroup {
    location: Vector2;
    color: Color;
    offsetMaps: any[];
    currentIndex: number;

    constructor() {
        this.location = new Vector2(0, 0);
        this.color = Colors.White;
        this.offsetMaps = [];
        this.currentIndex = 0;
    }

    clone() {
        let result = new BlockGroup();
        result.location = this.location.clone();
        result.color = this.color;
        result.offsetMaps = this.offsetMaps;
        result.currentIndex = this.currentIndex;
        return result;
    }

    setLocation(location: Vector2) {
        this.location = location;
        return this;
    }

    setColor(color: Color) {
        this.color = color;
        return this;
    }

    addOffsetMap(offsetMap: OffsetMap) {
        this.offsetMaps.push(offsetMap);
        return this;
    }

    addOffsetMapRange(range: any) {
        range.forEach((element: any) => {
            this.offsetMaps.push(element);
        });
        return this;
    }

    getLocations(indexOffset = 0) {
        let index = (this.currentIndex + indexOffset) % this.offsetMaps.length;
        return this.offsetMaps[index].getLocations(this.location);
    }

    getBlocks(indexOffset = 0) {
        let blocks: Block[] = [];
        this.getLocations(indexOffset).forEach((location: Vector2) => {
            blocks.push(new Block().setLocation(location).setColor(this.color.clone()));
        });
        return blocks;
    }

    move(offset: Vector2) {
        this.location = this.location.add(offset);
        return this;
    }

    rotate() {
        this.currentIndex = (this.currentIndex + 1) % this.offsetMaps.length;
        return this;
    }
}

class BlockGroupHelper {
    static getStandardGroups() {
        /*eslint-disable*/
        const maps = [
            //I
            [{
                x: [0, 0, 0, 0],
                y: [0, -1, -2, -3]
            }, {
                x: [0, 1, 2, 3],
                y: [0, 0, 0, 0]
            }],
            //J
            [{
                x: [1, 1, 1, 0],
                y: [0, -1, -2, -2]
            }, {
                x: [0, 0, 1, 2],
                y: [, -1, -1, -1]
            }, {
                x: [0, 1, 0, 0],
                y: [0, 0, -1, -2]
            }, {
                x: [0, 1, 2, 2],
                y: [0, 0, 0, -1]
            }],
            //L
            [{
                x: [0, 0, 0, 1],
                y: [0, -1, -2, -2]
            }, {
                x: [0, 1, 2, 0],
                y: [0, 0, 0, -1]
            }, {
                x: [0, 1, 1, 1],
                y: [0, 0, -1, -2]
            }, {
                x: [2, 0, 1, 2],
                y: [0, -1, -1, -1]
            }],
            //O
            [{
                x: [0, 1, 0, 1],
                y: [0, 0, -1, -1]
            }],
            //S
            [{
                x: [1, 2, 0, 1],
                y: [0, 0, -1, -1]
            }, {
                x: [0, 0, 1, 1],
                y: [0, -1, -1, -2]
            }],
            //Z
            [{
                x: [0, 1, 1, 2],
                y: [0, 0, -1, -1]
            }, {
                x: [1, 1, 0, 0],
                y: [0, -1, -1, -2]
            }],
            //T
            [{
                x: [0, 1, 2, 1],
                y: [0, 0, 0, -1]
            }, {
                x: [1, 0, 1, 1],
                y: [0, -1, -1, -2]
            }, {
                x: [1, 0, 1, 2],
                y: [0, -1, -1, -1]
            }, {
                x: [0, 0, 1, 0],
                y: [0, -1, -1, -2]
            }]
        ];
        /*eslint-enable*/

        return maps.map(g => new BlockGroup().addOffsetMapRange(g.map(o => new OffsetMap(o.x.map((x, index) => new Vector2(o.x[index], o.y[index]))))));
    }
}

export {
    BlockGroup,
    BlockGroupHelper
};