const kTetriminosTypes = [
    {
        id: 0,
        type: "EMPTY",
        // Reserved for empty blocks on the board
    },
    {
        // T-piece
        // Spawns with its flat side up, leaning left.
        id: 1,
        type: "T",
        baseBlocks: [
            [0, 0], // Pivot block
            [-1, 0], // Left arm
            [+1, 0], // Right arm
            [0, -1], // Top spike (negative Y is up)
        ],
        baseHeight: 2,
        basePosition: [4, 1], // Spawns in row 1, column 4
    },
    {
        // I-piece (long bar)
        // Spawns horizontally, centered.
        id: 2,
        type: "I",
        baseBlocks: [
            [0, 0], // Pivot block (slightly left of center)
            [-1, 0],
            [+1, 0],
            [+2, 0],
        ],
        baseHeight: 1,
        basePosition: [4, 0], // Spawns in row 0, centered
    },
    {
        // O-piece (square)
        // Spawns centered.
        id: 3,
        type: "O",
        baseBlocks: [
            [0, 0],
            [+1, 0],
            [0, +1],
            [+1, +1],
        ],
        baseHeight: 2,
        basePosition: [4, 0], // Spawns in row 0, centered
    },
    {
        // L-piece
        // Spawns with its flat side up, leaning left.
        id: 4,
        type: "L",
        baseBlocks: [
            [0, 0], // Pivot block
            [-1, 0],
            [+1, 0],
            [+1, -1], // Top-right corner
        ],
        baseHeight: 2,
        basePosition: [4, 1], // Spawns in row 1, column 4
    },
    {
        // J-piece
        // Spawns with its flat side up, leaning left.
        id: 5,
        type: "J",
        baseBlocks: [
            [0, 0], // Pivot block
            [-1, 0],
            [+1, 0],
            [-1, -1], // Top-left corner
        ],
        baseHeight: 2,
        basePosition: [4, 1], // Spawns in row 1, column 4
    },
    {
        // S-piece
        // Spawns horizontally, leaning left.
        id: 6,
        type: "S",
        baseBlocks: [
            [0, 0], // Pivot block
            [+1, 0],
            [0, -1],
            [-1, -1],
        ],
        baseHeight: 2,
        basePosition: [4, 1], // Spawns in row 1, column 4
    },
    {
        // Z-piece
        // Spawns horizontally, leaning left.
        id: 7,
        type: "Z",
        baseBlocks: [
            [0, 0], // Pivot block
            [-1, 0],
            [0, -1],
            [+1, -1],
        ],
        baseHeight: 2,
        basePosition: [4, 1], // Spawns in row 1, column 4
    },
];

export const kicksJLSTZ = {
    // Rotate right
    "0->1": [
        [0, 0],
        [-1, 0],
        [-1, +1],
        [0, -2],
        [-1, -2],
    ],
    "1->2": [
        [0, 0],
        [+1, 0],
        [+1, -1],
        [0, +2],
        [+1, +2],
    ],
    "2->3": [
        [0, 0],
        [+1, 0],
        [+1, +1],
        [0, -2],
        [+1, -2],
    ],
    "3->0": [
        [0, 0],
        [-1, 0],
        [-1, -1],
        [0, +2],
        [-1, +2],
    ],
    // Rotate left
    "1->0": [
        [0, 0],
        [+1, 0],
        [+1, -1],
        [0, +2],
        [+1, +2],
    ],
    "2->1": [
        [0, 0],
        [-1, 0],
        [-1, +1],
        [0, -2],
        [-1, -2],
    ],
    "3->2": [
        [0, 0],
        [-1, 0],
        [-1, -1],
        [0, +2],
        [-1, +2],
    ],
    "0->3": [
        [0, 0],
        [+1, 0],
        [+1, +1],
        [0, -2],
        [+1, -2],
    ],
};

export const kicksI = {
    // Rotate right
    "0->1": [
        [0, 0],
        [-2, 0],
        [+1, 0],
        [-2, -1],
        [+1, +2],
    ],
    "1->2": [
        [0, 0],
        [-1, 0],
        [+2, 0],
        [-1, +2],
        [+2, -1],
    ],
    "2->3": [
        [0, 0],
        [+2, 0],
        [-1, 0],
        [+2, +1],
        [-1, -2],
    ],
    "3->0": [
        [0, 0],
        [+1, 0],
        [-2, 0],
        [+1, -2],
        [-2, +1],
    ],
    // Rotate left
    "1->0": [
        [0, 0],
        [+2, 0],
        [-1, 0],
        [+2, +1],
        [-1, -2],
    ],
    "2->1": [
        [0, 0],
        [+1, 0],
        [-2, 0],
        [+1, -2],
        [-2, +1],
    ],
    "3->2": [
        [0, 0],
        [-2, 0],
        [+1, 0],
        [-2, -1],
        [+1, +2],
    ],
    "0->3": [
        [0, 0],
        [-1, 0],
        [+2, 0],
        [-1, +2],
        [+2, -1],
    ],
};

export const kRotateRight = "rotateright";
export const kRotateLeft = "rotateleft";
export const kMoveRight = "moveright";
export const kMoveLeft = "moveleft";
export const kMoveDown = "movedown";

class Tetrimino {
    constructor(id) {
        if (id == 0) {
            throw new Error("New tetrimino id must be different from 0");
        }

        this.id = id;
        this._baseBlocks = kTetriminosTypes[id].baseBlocks.map((coord) => [
            ...coord,
        ]);
        this._baseHeight = kTetriminosTypes[id].baseHeight;
        this._position = [...kTetriminosTypes[id].basePosition];
        this._orientation = 0;
        this._type = kTetriminosTypes[id].type;
        this.lastMove = null;
    }

    offset(dx, dy) {
        this._position[0] += dx;
        this._position[1] += dy;
    }

    getOrientation() {
        return this._orientation;
    }

    getType() {
        return this._type;
    }

    clone() {
        let newTetrimino = new Tetrimino(this.id);
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

    isLastMoveARotation() {
        return this.lastMove === kRotateLeft || this.lastMove === kRotateRight;
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
