import e from "express";

// Score constants based on classic Tetris scoring
const SCORE_SINGLE = 100;
const SCORE_DOUBLE = 300;
const SCORE_TRIPLE = 500;
const SCORE_TETRIS = 800;
const SCORE_SOFT_DROP = 1;
const SCORE_HARD_DROP = 2;
const SCORE_COMBO_BASE = 50;

export class BoardStats {
    #piecesDropped = 0;
    #linesCleared = 0;
    #startTime = null;
    #score = 0;
    #level = 1;
    #combo = -1; // -1 means no combo, 0 means first combo

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

    getScore() {
        return this.#score;
    }

    getLevel() {
        return this.#level;
    }

    getCombo() {
        return this.#combo;
    }

    /**
     * Calculate and add score for cleared lines
     * @param {number} linesCount - Number of lines cleared (1-4)
     */
    addScoreForLines(linesCount) {
        if (linesCount === 0) {
            this.#combo = -1; // Reset combo
            return;
        }

        const numberOfLinesBindWithScore = [
            0, // 0 lines
            SCORE_SINGLE, // 1 line
            SCORE_DOUBLE, // 2 lines
            SCORE_TRIPLE, // 3 lines
            SCORE_TETRIS, // 4 lines
        ];

        const baseScore =
            linesCount >= 0 && linesCount < numberOfLinesBindWithScore.length
                ? numberOfLinesBindWithScore[linesCount]
                : 0;

        // Apply level multiplier
        let scoreToAdd = baseScore * this.#level;

        // Apply combo bonus
        if (this.#combo >= 0) {
            const comboBonus = SCORE_COMBO_BASE * this.#combo * this.#level;
            scoreToAdd += comboBonus;
        }

        this.#score += scoreToAdd;
        this.#combo += 1; // Increment combo

        // Update level based on lines cleared (every 10 lines = +1 level)
        this.updateLevel();
    }

    /**
     * Add score for soft drop (1 point per cell)
     * @param {number} cells - Number of cells dropped
     */
    addScoreForSoftDrop(cells) {
        this.#score += cells * SCORE_SOFT_DROP;
    }

    /**
     * Add score for hard drop (2 points per cell)
     * @param {number} cells - Number of cells dropped
     */
    addScoreForHardDrop(cells) {
        this.#score += cells * SCORE_HARD_DROP;
    }

    /**
     * Update level based on lines cleared
     * Classic formula: level = 1 + (linesCleared / 10)
     */
    updateLevel() {
        this.#level = 1 + Math.floor(this.#linesCleared / 10);
    }

    /**
     * Reset combo when no lines are cleared
     */
    resetCombo() {
        this.#combo = -1;
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
        // if (this.#startTime === null) {
        //     return (0);
        // }

        const elapsedTime = Math.floor((Date.now() - this.#startTime) / 1000);

        return (this.#piecesDropped / elapsedTime).toFixed(2);
    }
}
