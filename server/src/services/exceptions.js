export class TetriminoOutOfBoundsException extends Error {
    constructor(message) {
        super(message);
        this.name = "TetriminoOutOfBoundsException";
    }
}
