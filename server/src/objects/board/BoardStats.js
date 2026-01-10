export class BoardStats {
    #piecesDropped = 0;
    #linesCleared = 0;
    #startTime = null;

    // constructor() {
    // }

    incrementPiecesDropped() {
        this.#piecesDropped += 1;
    }

    addToLinesCleared(number) {
        this.#linesCleared += number;
    }

    getPiecesDropped() {
        return this.#piecesDropped;
    }

    getLinesCleared() {
        return this.#linesCleared;
    }

    startTimer() {
        if (this.#startTime !== null) {
            throw new Error(
                "startTimer() called but startTime is already set."
            );
        }

        this.#startTime = Date.now();
    }

    getPPS() {
        if (this.#startTime === null) {
            throw new Error("getPPS() called but startTime was never set.");
        }

        return Math.floor((Date.now - this.#startTime) / 1000);
    }
}
