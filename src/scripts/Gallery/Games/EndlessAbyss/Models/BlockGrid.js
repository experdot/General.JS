import {
    Array2
} from "../../../../Engine/Collections/Array2";
import {
    Vector2
} from "../../../../Engine/Numerics/Vector2";
import {
    Color
} from "../../../../Engine/UI/Color";
import {
    BlockGroupHelper
} from "./BlockGroup";
import {
    Block
} from "./Block/Block";

class BlockGrid extends Array2 {
    get allBlocks() {
        return this._allBlocks;
    }
    get preBlocks() {
        return this._preBlocks;
    }

    constructor(width = 1, height = 1) {
        super(width, height);
        this.current = null;
        this.next = null;
        this.upOffset = new Vector2(0, 0);
        this.downOffset = new Vector2(0, -1);
        this.leftOffset = new Vector2(-1, 0);
        this.rightOffset = new Vector2(1, 0);
        this.indexOffset = 1;

        let colors = ["#8F1D78", "#BA874C", "#E9AE6A"];
        this.colors = colors.map(v => Color.fromHex(v));

        this.blockGroups = BlockGroupHelper.getStandardGroups();
        this._generateNext();
        this._generateCurrent();

        this.onOver = null;
        this.onFullRow = null;
    }

    up() {
        if (this._checkMoveAvaliable(this.current, this.upOffset, this.indexOffset)) {
            this.current.move(this.upOffset).rotate(this.indexOffset);
        }
    }

    down() {
        if (this._checkMoveAvaliable(this.current, this.downOffset)) {
            this.current.move(this.downOffset);
        } else {
            if (this.current.location.y === this.height - 1) {
                this.over();
            } else {
                this._combineBlock(this.current);
                this._generateCurrent();
            }
        }
    }

    left() {
        if (this._checkMoveAvaliable(this.current, this.leftOffset)) {
            this.current.move(this.leftOffset);
        }
    }

    right() {
        if (this._checkMoveAvaliable(this.current, this.rightOffset)) {
            this.current.move(this.rightOffset);
        }
    }

    reset() {
        this.forEach((block, x, y) => {
            this.set(x, y, null);
        });
    }

    over() {
        this.onOver && this.onOver();
    }

    setCurrent(current) {
        this.current = current;
    }

    _generateCurrent() {
        this.current = this.next;
        this._generateNext();
        this._generateInformation();
    }

    _generateNext() {
        let nextIndex = Math.floor(Math.random() * this.blockGroups.length);
        let nextLocation = new Vector2(Math.floor(this.width * Math.random()), this.height - 1);
        let nextRotation = Math.floor(Math.random() * 4);
        let color = this.colors[Math.floor(this.colors.length * Math.random())];
        this.next = this.blockGroups[nextIndex].clone().setLocation(nextLocation).setColor(color).rotate(nextRotation);
    }

    _generateInformation() {
        this._allBlocks = [];
        this._preBlocks = [];
        let maxRow = this._findMaxRow();
        this.forEach((block, x, y) => {
            this._allBlocks.push(block ? block : new Block(x, y));
            if (!block && y <= maxRow) {
                this._preBlocks.push(new Block(x, y));
            }
        });
    }

    _checkMoveAvaliable(group, offset = Vector2.Zero(), indexOffset = 0, annular = true) {
        let locations = this.current.getLocations(indexOffset);
        for (let index = 0; index < locations.length; index++) {
            const location = locations[index].add(offset);
            if (annular) {
                location.x = location.x % this.width;
                if (location.x < 0) {
                    location.x += this.width;
                }
            }
            if (location.y < 0 || this.get(location.x, location.y)) {
                return false;
            }
        }
        return true;
    }

    _combineBlock(target, annular = true) {
        target.getBlocks().forEach(block => {
            if (block) {
                if (annular) {
                    block.location.x = block.location.x % this.width;
                    if (block.location.x < 0) {
                        block.location.x += this.width;
                    }
                }
                this.set(block.location.x, block.location.y, block);
            }
        });
        this._combineFullRow();
    }

    _combineFullRow() {
        let maxRow = this._findMaxRow();
        let combineCount = 0;
        for (let y = maxRow; y >= 0; y--) {
            if (this._checkFullRow(y)) {
                this._clearSingleRow(y);
                combineCount += 1;
            }
        }
        if (combineCount > 0) {
            this.onFullRow && this.onFullRow(combineCount);
            this._updateBlockLocation();
        }
    }

    _findMaxRow() {
        let max = -1;
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.get(x, y)) {
                    max = y;
                    break;
                }
            }
        }
        return max;
    }
    _clearSingleRow(y) {
        for (let x = 0; x < this.width; x++) {
            this.data[x].splice(y, 1);
            this.data[x].push(null);
        }
    }
    _checkFullRow(y) {
        for (let x = 0; x < this.width; x++) {
            if (!this.get(x, y)) {
                return false;
            }
        }
        return true;
    }
    _updateBlockLocation() {
        this.forEach((block, x, y) => {
            block && block.setLocation(new Vector2(x, y));
        });
    }
}

export {
    BlockGrid
};