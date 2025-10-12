const kTetriminosTypes = [
    {
        id: 0,
        // Reserved to empty block
    },
    {
        //	XXX
        //   X
        id: 1,
        _baseBlocks: [
            [0, 0],
            [1, 1],
            [-1, 1],
            [0, 1],
        ],
        rotateOn: [0, 1],
    },
    // etc
];

const kRotate = "rotate";
const kMoveRight = "moveright";
const kMoveLeft = "moveleft";
const kMoveDown = "movedown";

class Tetrimino {
    constructor(id) {
        if (id == 0) {
            throw new Error("New tetrimino id must be different from 0");
        }

        this.id = id;
        this._baseBlocks = kTetriminosTypes[id]._baseBlocks;
        // this.rotateOn = kTetriminosTypes[id].rotateOn;
        this._orientation = 0;
        this._position = [5, 0];
        this.lastMove = null;
    }

    clone(id) {
        let newTetrimino = new Tetrimino(this.id);
        newTetrimino._baseBlocks = kTetriminosTypes[id]._baseBlocks;
        newTetrimino._orientation = this._orientation;
        newTetrimino._position = [...this._position];
        newTetrimino.lastMove = this.lastMove;

        return newTetrimino;
    }

    getAbsoluteBlocksPositionArray() {
        const posX = this._position[0];
        const posY = this._position[1];
        let rotatedRelativeBlocks = this._baseBlocks.map((block) => [...block]);

        for (let i = 0; i < this._orientation; i++) {
            rotatedRelativeBlocks = rotatedRelativeBlocks.map(([x, y]) => [
                y,
                -x,
            ]);
        }

        return rotatedRelativeBlocks.map(([x, y]) => [x + posX, y + posY]);
    }

    moveUp() {
        this._position[1] -= 1;
    }

    // TODO - check top too ?
    isVerticallyOutOfBounds() {
        return this.getAbsoluteBlocksPositionArray().some(([x, y]) => y >= 20);
    }

    isHorizontallyOutOfBounds() {
        return this.getAbsoluteBlocksPositionArray().some(
            ([x, y]) => x >= 10 || x < 0
        );
    }

    rotate() {
        this._orientation = (this._orientation + 1) % 4;
        this.lastMove = kRotate;
    }

    moveRight() {
        this._position[0] += 1;
        this.lastMove = kMoveRight;
    }

    moveLeft() {
        this._position[0] -= 1;
        this.lastMove = kMoveLeft;
    }

    moveDown() {
        this._position[1] += 1;
        this.lastMove = kMoveDown;
    }

    enforceMove(move) {
        if (move === kMoveDown) {
            this.moveDown();
        }

        if (move === kMoveRight) {
            this.moveRight();
        }

        if (move === kMoveLeft) {
            this.moveLeft();
        }

        if (move === kRotate) {
            this.rotate();
        }
    }

    cancelLastMove() {
        if (this.lastMove === kRotate) {
            this._orientation = (this._orientation + 3) % 4;
        } else if (this.lastMove === kMoveRight) {
            this._position[0] -= 1;
        } else if (this.lastMove === kMoveLeft) {
            this._position[0] += 1;
        }
    }
}

export default Tetrimino;
