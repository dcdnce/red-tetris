import { describe, it, beforeEach, afterEach, vi, expect } from "vitest";

// --- IMPORTER LES MODULES ---
import handleRoomJoinRequest from "../../src/socket-events/handlers/handleRoomJoinRequest.js";
import GameMapSingleton from "../../src/services/gameMapSingleton.js";
import { initializeSocketIO } from "../../src/socket-events/initialize_socketio.js";

// --- MOCKING if needed ---
// vi.mock("../../src/socket-events/emitters/emit_update_player_list.js", () => ({
//     default: vi.fn(),
// }));

describe("Game", () => {
    let mockSocket;
    let currentGame;
    initializeSocketIO();

    const simulateRoomJoinEvent = (params) =>
        simulateEvent("room_join", params);

    const simulateEvent = (eventName, params) => {
        // Trouve le bon callback en cherchant l'événement par son nom
        const eventCallback = mockSocket.on.mock.calls.find(
            (call) => call[0] === eventName
        )?.[1]; // ?.[1] pour éviter une erreur si l'événement n'est pas trouvé

        if (eventCallback) {
            eventCallback(params);
        } else {
            throw new Error(
                `Listener for event "${eventName}" not found on mock socket.`
            );
        }
    };

    beforeEach(() => {
        vi.useFakeTimers();

        mockSocket = {
            on: vi.fn(),
            emit: vi.fn(),
            join: vi.fn(),
            leave: vi.fn(),
            id: `socket-id-${Math.random()}`,
        };

        handleRoomJoinRequest(mockSocket);

        simulateRoomJoinEvent({
            roomName: "room1",
            username: "Paul",
            token: null,
        });

        simulateRoomJoinEvent({
            roomName: "room1",
            username: "Sacha",
            token: null,
        });

        currentGame = GameMapSingleton.get("room1");
    });

    afterEach(() => {
        // Clean spies and mocks
        vi.clearAllMocks();
        vi.useRealTimers();
        GameMapSingleton.clear();
    });

    // --- TESTS ---
    it("startGame() should generate valid 7-piece bags", () => {
        currentGame.startGame();

        // Each bag contains 7 pieces
        for (
            let bagIndex = 0;
            bagIndex < currentGame.piecesSequence.length / 7;
            bagIndex++
        ) {
            // Iteration through the bags
            const bag = currentGame.piecesSequence.slice(
                bagIndex * 7,
                bagIndex * 7 + 7
            ); // slice -> create array with, begin and end

            expect(bag).toHaveLength(7);
            const uniquePieces = new Set(bag);
            expect(uniquePieces.size).toBe(7);
            expect([...uniquePieces].sort()).toEqual([1, 2, 3, 4, 5, 6, 7]);
        }

        currentGame.endAndDelete();
    });

    // TODO
    // - test ticks() and associated methods (gamelogichandler)
});
