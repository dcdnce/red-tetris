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
            [-1, 0],
            [1, 0],
            [0, -1],
        ],
        baseHeight: 2,
        basePosition: [5, 1],
    },
    // etc
];

const kRotateRight = "rotateright";
const kRotateLeft = "rotateleft";
const kMoveRight = "moveright";
const kMoveLeft = "moveleft";
const kMoveDown = "movedown";

class Tetrimino {
    constructor(id) {
        if (id == 0) {
            throw new Error("New tetrimino id must be different from 0");
        }

        this.id = id;
        this._baseBlocks = kTetriminosTypes[id]._baseBlocks.map((coord) => [
            ...coord,
        ]);
        this._baseHeight = kTetriminosTypes[id].baseHeight;
        this._position = [...kTetriminosTypes[id].basePosition];
        this._orientation = 0;
        this.lastMove = null;
    }

    clone(id) {
        let newTetrimino = new Tetrimino(this.id);
        this._baseBlocks = kTetriminosTypes[id]._baseBlocks.map((coord) => [
            ...coord,
        ]);
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
                -y,
                x,
            ]);
        }

        return rotatedRelativeBlocks.map(([x, y]) => [x + posX, y + posY]);
    }

    moveUp() {
        this._position[1] -= 1;
    }

    // TODO - check top too ?
    isVerticallyOutOfBoundsBottom() {
        return this.getAbsoluteBlocksPositionArray().some(([x, y]) => y >= 20);
    }

    isHorizontallyOutOfBounds() {
        return this.getAbsoluteBlocksPositionArray().some(
            ([x, y]) => x >= 10 || x < 0
        );
    }

    rotateRight() {
        this._orientation = (this._orientation + 1) % 4;
        this.lastMove = kRotateRight;
    }

    rotateLeft() {
        this._orientation = (4 + (this._orientation - 1)) % 4;
        this.lastMove = kRotateLeft;
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

        if (move === kRotateRight) {
            this.rotateRight();
        }

        if (move === kRotateLeft) {
            this.rotateLeft();
        }
    }
}

export default Tetrimino;
