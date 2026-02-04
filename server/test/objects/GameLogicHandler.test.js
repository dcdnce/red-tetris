import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import GameLogicHandler from "../../src/objects/gamelogichandler.js"; // Ajustez le chemin
import * as disconnectionManager from "../../src/socket-events/handlers/handleRoomExit.js"; // Pour mocker definitiveDisconnection
import { TetriminoOutOfBoundsException } from "../../src/services/exceptions.js";

const createMockPlayer = (username, overrides = {}) => {
    return {
        username: username,
        isOutOfPlay: false,
        isConnected: true,
        decrementGraceTicks: vi.fn(),
        handleTetriminoSpawn: vi.fn(),
        handleFallOrLock: vi.fn(),
        handleEPLLockDelay: vi.fn(),
        getBoardObject: vi.fn(() => ({
            getClearedLinesNumber: vi.fn().mockReturnValue(0),
            resetClearedLinesNumber: vi.fn(),
        })),
        addIndestructibleLines: vi.fn(),
        setOutOfPlay: vi.fn(function () {
            this.isOutOfPlay = true;
        }),
        ...overrides,
    };
};

describe("GameLogicHandler", () => {
    let mockPlayers;
    let onGameEndCallback;
    let gameLogicHandler;
    let definitiveDisconnectionSpy;

    beforeEach(() => {
        // Spy and Mock
        definitiveDisconnectionSpy = vi
            .spyOn(disconnectionManager, "definitiveDisconnection")
            .mockImplementation(() => {});

        mockPlayers = new Map([
            ["Sacha", createMockPlayer("Sacha")],
            ["Paul", createMockPlayer("Paul")],
        ]);
        onGameEndCallback = vi.fn();
        gameLogicHandler = new GameLogicHandler(
            "test-room",
            mockPlayers,
            onGameEndCallback
        );

        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("tick method", () => {
        it("should call all handler methods for each connected player", () => {
            gameLogicHandler.tick();

            const playerSacha = mockPlayers.get("Sacha");
            const playerPaul = mockPlayers.get("Paul");

            // Verify each handler
            expect(playerSacha.decrementGraceTicks).not.toHaveBeenCalled();
            expect(playerSacha.handleEPLLockDelay).toHaveBeenCalledTimes(1);
            expect(playerSacha.handleFallOrLock).toHaveBeenCalledTimes(1);
            expect(playerSacha.handleTetriminoSpawn).toHaveBeenCalledTimes(1);

            expect(playerPaul.decrementGraceTicks).not.toHaveBeenCalled();
            expect(playerPaul.handleEPLLockDelay).toHaveBeenCalledTimes(1);
            expect(playerPaul.handleFallOrLock).toHaveBeenCalledTimes(1);
            expect(playerPaul.handleTetriminoSpawn).toHaveBeenCalledTimes(1);

            expect(onGameEndCallback).not.toHaveBeenCalled();
        });

        it("should call onGameEndCallback if all players have lost", () => {
            mockPlayers.forEach((p) => (p.isOutOfPlay = true));

            gameLogicHandler.tick();

            expect(onGameEndCallback).toHaveBeenCalledTimes(1);
        });

        it("should decrement grace ticks for a disconnected player", () => {
            const playerSacha = mockPlayers.get("Sacha");
            playerSacha.isConnected = false;
            playerSacha.decrementGraceTicks.mockReturnValue(10);

            gameLogicHandler.tick();

            expect(playerSacha.decrementGraceTicks).toHaveBeenCalledTimes(1);
            expect(definitiveDisconnectionSpy).not.toHaveBeenCalled(); // Pas encore
        });

        it("should call definitiveDisconnection when grace ticks run out", () => {
            const playerSacha = mockPlayers.get("Sacha");
            playerSacha.isConnected = false;
            playerSacha.decrementGraceTicks.mockReturnValue(0);

            gameLogicHandler.tick();

            expect(playerSacha.decrementGraceTicks).toHaveBeenCalledTimes(1);
            expect(definitiveDisconnectionSpy).toHaveBeenCalledWith(
                playerSacha
            );
        });

        it("should not call game logic methods for a player who has already lost", () => {
            const playerSacha = mockPlayers.get("Sacha");
            playerSacha.isOutOfPlay = true;

            gameLogicHandler.tick();

            expect(playerSacha.handleFallOrLock).not.toHaveBeenCalled();
            expect(playerSacha.handleTetriminoSpawn).not.toHaveBeenCalled();
            expect(playerSacha.handleEPLLockDelay).not.toHaveBeenCalled();
        });
    });

    describe("handleNewIndestructibleLines", () => {
        it("should add penalty lines to opponents when a player clears lines", () => {
            const playerSacha = mockPlayers.get("Sacha");
            const playerPaul = mockPlayers.get("Paul");

            const SachaBoardMock = {
                getClearedLinesNumber: vi.fn().mockReturnValue(2),
                resetClearedLinesNumber: vi.fn(),
            };
            playerSacha.getBoardObject.mockReturnValue(SachaBoardMock);

            gameLogicHandler.handleNewIndestructibleLines();

            expect(playerPaul.addIndestructibleLines).toHaveBeenCalledWith(2);
            expect(playerSacha.addIndestructibleLines).toHaveBeenCalledWith(0);

            expect(
                SachaBoardMock.resetClearedLinesNumber
            ).toHaveBeenCalledTimes(1);
        });

        it("should call setOutOfPlay if addIndestructibleLines throws an exception", () => {
            const playerSacha = mockPlayers.get("Sacha");
            const playerPaul = mockPlayers.get("Paul");

            playerSacha
                .getBoardObject()
                .getClearedLinesNumber.mockReturnValue(1);

            const error = new TetriminoOutOfBoundsException("Top out");
            playerPaul.addIndestructibleLines.mockImplementation(() => {
                throw error;
            });

            gameLogicHandler.handleNewIndestructibleLines();

            expect(playerPaul.setOutOfPlay).toHaveBeenCalledTimes(1);
            expect(playerSacha.setOutOfPlay).not.toHaveBeenCalled();
        });
    });
});
