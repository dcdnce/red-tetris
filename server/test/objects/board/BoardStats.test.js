import { describe, it, beforeEach, afterEach, vi, expect } from "vitest";
import { BoardStats } from "../../../src/objects/board/BoardStats.js";

// Score constants (same as in BoardStats.js)
const SCORE_SINGLE = 100;
const SCORE_DOUBLE = 300;
const SCORE_TRIPLE = 500;
const SCORE_TETRIS = 800;
const SCORE_SOFT_DROP = 1;
const SCORE_HARD_DROP = 2;
const SCORE_COMBO_BASE = 50;

describe("BoardStats", () => {
    let stats;

    beforeEach(() => {
        vi.useFakeTimers();
        stats = new BoardStats();
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.useRealTimers();
        stats = null;
    });

    // --- BASIC GETTERS AND SETTERS ---
    describe("Basic functionality", () => {
        it("should initialize with default values", () => {
            expect(stats.getPiecesDropped()).toBe(0);
            expect(stats.getLinesCleared()).toBe(0);
            expect(stats.getScore()).toBe(0);
            expect(stats.getLevel()).toBe(1);
            expect(stats.getCombo()).toBe(-1);
        });

        it("should increment pieces dropped", () => {
            stats.incrementPiecesDropped();
            expect(stats.getPiecesDropped()).toBe(1);

            stats.incrementPiecesDropped();
            stats.incrementPiecesDropped();
            expect(stats.getPiecesDropped()).toBe(3);
        });

        it("should add to lines cleared", () => {
            stats.addToLinesCleared(1);
            expect(stats.getLinesCleared()).toBe(1);

            stats.addToLinesCleared(4);
            expect(stats.getLinesCleared()).toBe(5);
        });
    });

    // --- SCORE FOR LINES CLEARED ---
    describe("Score for lines cleared", () => {
        it("should return 0 score for 0 lines cleared at level 1", () => {
            stats.addScoreForLines(0);
            expect(stats.getScore()).toBe(0);
        });

        it("should add correct score for single line at level 1", () => {
            stats.addToLinesCleared(1);
            stats.addScoreForLines(1);
            expect(stats.getScore()).toBe(SCORE_SINGLE);
        });

        it("should add correct score for double line at level 1", () => {
            stats.addToLinesCleared(2);
            stats.addScoreForLines(2);
            expect(stats.getScore()).toBe(SCORE_DOUBLE);
        });

        it("should add correct score for triple line at level 1", () => {
            stats.addToLinesCleared(3);
            stats.addScoreForLines(3);
            expect(stats.getScore()).toBe(SCORE_TRIPLE);
        });

        it("should add correct score for tetris at level 1", () => {
            stats.addToLinesCleared(4);
            stats.addScoreForLines(4);
            expect(stats.getScore()).toBe(SCORE_TETRIS);
        });

        it("should apply level multiplier to score", () => {
            // Clear 10 lines to reach level 2
            stats.addToLinesCleared(10);
            stats.updateLevel();
            expect(stats.getLevel()).toBe(2);

            stats.addToLinesCleared(1);
            stats.addScoreForLines(1);
            expect(stats.getScore()).toBe(SCORE_SINGLE * 2); // 100 * 2 = 200
        });

        it("should apply combo bonus correctly", () => {
            // First clear: no combo bonus
            stats.addToLinesCleared(1);
            stats.addScoreForLines(1);
            expect(stats.getScore()).toBe(SCORE_SINGLE); // 100
            expect(stats.getCombo()).toBe(0); // First combo

            // Second clear: combo = 0, bonus = 50 * 0 * 1 = 0
            stats.addToLinesCleared(1);
            stats.addScoreForLines(1);
            expect(stats.getScore()).toBe(SCORE_SINGLE * 2); // 100 + 100 = 200
            expect(stats.getCombo()).toBe(1); // Combo incremented

            // Third clear: combo = 1, bonus = 50 * 1 * 1 = 50
            stats.addToLinesCleared(1);
            stats.addScoreForLines(1);
            expect(stats.getScore()).toBe(SCORE_SINGLE * 3 + 50); // 200 + 100 + 50 = 350
            expect(stats.getCombo()).toBe(2);
        });

        it("should reset combo after clearing 0 lines (commented out behavior)", () => {
            // First clear to establish combo
            stats.addToLinesCleared(1);
            stats.addScoreForLines(1);
            expect(stats.getCombo()).toBe(0);

            // Note: The reset behavior for 0 lines is commented out in the source
            // This test documents the current behavior (no reset)
            stats.addScoreForLines(0);
            expect(stats.getCombo()).toBe(1); // Combo incremented even for 0 lines
        });

        it("should handle combo with level multiplier", () => {
            // Reach level 2
            stats.addToLinesCleared(10);
            stats.updateLevel();
            expect(stats.getLevel()).toBe(2);

            // First clear at level 2
            stats.addToLinesCleared(1);
            stats.addScoreForLines(1);
            expect(stats.getScore()).toBe(SCORE_SINGLE * 2); // 200

            // Second clear: combo = 0, bonus = 50 * 0 * 2 = 0
            stats.addToLinesCleared(1);
            stats.addScoreForLines(1);
            expect(stats.getScore()).toBe(SCORE_SINGLE * 2 * 2); // 200 + 200 = 400

            // Third clear: combo = 1, bonus = 50 * 1 * 2 = 100
            stats.addToLinesCleared(1);
            stats.addScoreForLines(1);
            expect(stats.getScore()).toBe(SCORE_SINGLE * 2 * 3 + 100); // 400 + 200 + 100 = 700
        });
    });

    // --- SOFT DROP SCORE ---
    describe("Soft drop score", () => {
        it("should add 1 point per cell for soft drop", () => {
            stats.addScoreForSoftDrop(5);
            expect(stats.getScore()).toBe(5);

            stats.addScoreForSoftDrop(3);
            expect(stats.getScore()).toBe(8);
        });

        it("should accumulate soft drop with line clear score", () => {
            stats.addScoreForSoftDrop(10);
            stats.addToLinesCleared(1);
            stats.addScoreForLines(1);
            expect(stats.getScore()).toBe(10 + SCORE_SINGLE);
        });
    });

    // --- HARD DROP SCORE ---
    describe("Hard drop score", () => {
        it("should add 2 points per cell for hard drop", () => {
            stats.addScoreForHardDrop(5);
            expect(stats.getScore()).toBe(10);

            stats.addScoreForHardDrop(3);
            expect(stats.getScore()).toBe(16);
        });

        it("should accumulate hard drop with line clear score", () => {
            stats.addScoreForHardDrop(10);
            stats.addToLinesCleared(4);
            stats.addScoreForLines(4);
            expect(stats.getScore()).toBe(20 + SCORE_TETRIS);
        });
    });

    // --- LEVEL SYSTEM ---
    describe("Level system", () => {
        it("should start at level 1", () => {
            expect(stats.getLevel()).toBe(1);
        });

        it("should increase level after 10 lines cleared", () => {
            stats.addToLinesCleared(10);
            stats.updateLevel();
            expect(stats.getLevel()).toBe(2);
        });

        it("should increase level after 20 lines cleared", () => {
            stats.addToLinesCleared(20);
            stats.updateLevel();
            expect(stats.getLevel()).toBe(3);
        });

        it("should calculate level correctly for any number of lines", () => {
            stats.addToLinesCleared(35);
            stats.updateLevel();
            expect(stats.getLevel()).toBe(4); // 1 + floor(35/10) = 4

            stats.addToLinesCleared(14); // Total 49
            stats.updateLevel();
            expect(stats.getLevel()).toBe(5); // 1 + floor(49/10) = 5
        });

        it("should update level automatically when adding score for lines", () => {
            stats.addToLinesCleared(10);
            stats.addScoreForLines(1);
            expect(stats.getLevel()).toBe(2);
        });
    });

    // --- COMBO SYSTEM ---
    describe("Combo system", () => {
        it("should start with combo -1 (no combo)", () => {
            expect(stats.getCombo()).toBe(-1);
        });

        it("should increment combo on consecutive line clears", () => {
            stats.addToLinesCleared(1);
            stats.addScoreForLines(1);
            expect(stats.getCombo()).toBe(0);

            stats.addToLinesCleared(1);
            stats.addScoreForLines(1);
            expect(stats.getCombo()).toBe(1);

            stats.addToLinesCleared(1);
            stats.addScoreForLines(1);
            expect(stats.getCombo()).toBe(2);
        });

        it("should reset combo manually", () => {
            stats.addToLinesCleared(2);
            stats.addScoreForLines(2);
            expect(stats.getCombo()).toBe(0);

            stats.resetCombo();
            expect(stats.getCombo()).toBe(-1);
        });
    });

    // --- TIMER AND PPS ---
    describe("Timer and PPS calculation", () => {
        it("should start timer correctly", () => {
            const startTime = Date.now();
            stats.startTimer();

            // Advance time by 1 second
            vi.advanceTimersByTime(1000);

            const pps = stats.getPPS();
            expect(parseFloat(pps)).toBe(0); // 0 pieces / 1 second = 0
        });

        it("should throw error if timer is started twice", () => {
            stats.startTimer();
            expect(() => stats.startTimer()).toThrowError(
                "startTimer() called but startTime is already set."
            );
        });

        it("should calculate PPS correctly", () => {
            stats.startTimer();

            // Drop 10 pieces
            for (let i = 0; i < 10; i++) {
                stats.incrementPiecesDropped();
            }

            // Advance time by 5 seconds
            vi.advanceTimersByTime(5000);

            const pps = stats.getPPS();
            expect(parseFloat(pps)).toBe(2.0); // 10 pieces / 5 seconds = 2.0
        });

        it("should update PPS as time and pieces increase", () => {
            stats.startTimer();

            // Drop 5 pieces
            for (let i = 0; i < 5; i++) {
                stats.incrementPiecesDropped();
            }

            // Advance time by 2 seconds
            vi.advanceTimersByTime(2000);

            let pps = stats.getPPS();
            expect(parseFloat(pps)).toBe(2.5); // 5 pieces / 2 seconds = 2.5

            // Drop 5 more pieces
            for (let i = 0; i < 5; i++) {
                stats.incrementPiecesDropped();
            }

            // Advance time by 3 more seconds (total 5 seconds)
            vi.advanceTimersByTime(3000);

            pps = stats.getPPS();
            expect(parseFloat(pps)).toBe(2.0); // 10 pieces / 5 seconds = 2.0
        });
    });

    // --- INTEGRATION TESTS ---
    describe("Integration scenarios", () => {
        it("should handle a complete game scenario", () => {
            stats.startTimer();

            // Start at level 1, drop first piece
            stats.incrementPiecesDropped();
            stats.addScoreForHardDrop(5);
            stats.addToLinesCleared(1);
            stats.addScoreForLines(1);

            expect(stats.getScore()).toBe(10 + SCORE_SINGLE); // 110
            expect(stats.getLevel()).toBe(1);
            expect(stats.getCombo()).toBe(0);

            // Drop second piece with combo
            stats.incrementPiecesDropped();
            stats.addScoreForSoftDrop(3);
            stats.addToLinesCleared(2);
            stats.addScoreForLines(2);

            // Score: 110 + 3 + (300 * 1) = 413
            expect(stats.getScore()).toBe(413);
            expect(stats.getCombo()).toBe(1);

            // Drop 8 more pieces to reach level 2
            for (let i = 0; i < 8; i++) {
                stats.incrementPiecesDropped();
                stats.addToLinesCleared(1);
            }
            stats.updateLevel();
            expect(stats.getLevel()).toBe(2);

            // Drop tetris at level 2 with combo = 1
            stats.incrementPiecesDropped();
            stats.addToLinesCleared(4);
            stats.addScoreForLines(4);

            // Score: 413 + (800 * 2) + (50 * 1 * 2) = 413 + 1600 + 100 = 2113
            expect(stats.getScore()).toBe(2113);
            expect(stats.getLevel()).toBe(2);
            expect(stats.getCombo()).toBe(2);
        });
    });
});
