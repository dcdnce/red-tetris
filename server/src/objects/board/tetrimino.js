import { kTetriminosTypes } from "../../constants/tetriminos_constants.js";
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../constants/board_constants.js";
import { BoardRules } from "./boardrules.js";

export const kRotateRight = "rotateright";
export const kRotateLeft = "rotateleft";
export const kMoveRight = "moveright";
export const kMoveLeft = "moveleft";
export const kMoveDown = "movedown";
export const kHardDrop = "harddrop";

export class Tetrimino {
    constructor(id) {
        if (id == 0) {
            throw new Error("New tetrimino id must be different from 0");
        }
        this.id = id;
        this._rotationStates = kTetriminosTypes[id].rotationStates;
        this._position = [...kTetriminosTypes[id].basePosition];
        this._orientation = 0;
        this._type = kTetriminosTypes[id].type;
        this.lastMove = null;
        this._lowestY = this._position[1];
    }

    offset(dx, dy) {
        this._position[0] += dx;
        this._position[1] += dy;
    }

    clone() {
        let newTetrimino = new Tetrimino(this.id);
        newTetrimino._orientation = this._orientation;
        newTetrimino._position = [...this._position];
        newTetrimino.lastMove = this.lastMove;
        newTetrimino.setLowestY(this._lowestY);

        return newTetrimino;
    }

    moveUp() {
        this._position[1] -= 1;
    }

    isVerticallyOutOfBoundsBottom() {
        return this.getAbsoluteBlocksPositionArray().some(
            ([x, y]) => y >= BOARD_HEIGHT
        );
    }

    isVerticallyOutOfBounds() {
        return this.getAbsoluteBlocksPositionArray().some(
            ([x, y]) => y >= BOARD_HEIGHT || y < 0
        );
    }

    isHorizontallyOutOfBounds() {
        return this.getAbsoluteBlocksPositionArray().some(
            ([x, y]) => x >= BOARD_WIDTH || x < 0
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

    hardDrop(board) {
        while (!BoardRules.isTetriminoInLockState(board, this)) {
            this.moveDown();
        }
        this.moveUp();
        this.lastMove = kHardDrop;
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

    // GETTERS and SETTERS
    getY() {
        return this._position[1];
    }

    getLowestY() {
        return this._lowestY;
    }

    setLowestY(y) {
        this._lowestY = y;
    }

    getAbsoluteBlocksPositionArray() {
        const relativeBlocks = this._rotationStates[this._orientation];

        if (!relativeBlocks) {
            throw Error(
                `Invalid orientation: ${this._orientation} for type ${this._type}`
            );
        }

        const [posX, posY] = this._position;
        return relativeBlocks.map(([x, y]) => [x + posX, y + posY]);
    }

    getOrientation() {
        return this._orientation;
    }

    getType() {
        return this._type;
    }

    getPosition() {
        return [...this._position];
    }
}
