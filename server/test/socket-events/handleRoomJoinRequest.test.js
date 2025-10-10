import { describe, it, expect, beforeEach, afterEach, jest } from "vitest";

// --- IMPORTER LES MODULES ---
import handleRoomJoinRequest from "../../src/socket-events/tetris-events/handleRoomJoinRequest.js";
import GameMapSingleton from "../../src/objects/gameMapSingleton.js";
import Game from "../../src/objects/game.js";
import Player from "../../src/objects/player.js";
import emitUpdatePlayerList from "../../src/socket-events/tetris-events/emit_update_player_list.js";
import emitJoinRoomFail from "../../src/socket-events/tetris-events/emit_join_room_fail.js";
import emitJoinRoomSuccess from "../../src/socket-events/tetris-events/emit_join_room_success.js";

// --- MOCKING ---
vi.mock(
    "../../src/socket-events/tetris-events/emit_update_player_list.js",
    () => ({
        default: vi.fn(),
    })
);
vi.mock("../../src/socket-events/tetris-events/emit_join_room_fail.js", () => ({
    default: vi.fn(),
}));
vi.mock(
    "../../src/socket-events/tetris-events/emit_join_room_success.js",
    () => ({
        default: vi.fn(),
    })
);

describe("handleRoomJoinRequest", () => {
    let mockSocket;
    const gameMapInstance = new GameMapSingleton();

    beforeEach(() => {
        // Nettoyer les mocks
        vi.clearAllMocks();

        mockSocket = {
            on: vi.fn(),
            emit: vi.fn(),
            join: vi.fn(),
            id: `socket-id-${Math.random()}`,
        };

        handleRoomJoinRequest(mockSocket);
    });

    afterEach(() => {
        gameMapInstance.clear();
    });

    const simulateRoomJoinEvent = (params) => {
        const roomJoinCallback = mockSocket.on.mock.calls[0][1]; // C'est le 2e argument du 1er appel
        roomJoinCallback(params);
    };

    // --- TESTS ---
    it("should create a new game and add a player when a room does not exist", () => {
        const params = { roomName: "room1", username: "Paul", token: null };
        expect(gameMapInstance.has("room1")).toBe(false);

        simulateRoomJoinEvent(params);

        expect(gameMapInstance.has("room1")).toBe(true);
        const game = gameMapInstance.get("room1");
        expect(game).toBeInstanceOf(Game);
        expect(game.players.has("Paul")).toBe(true);

        expect(emitJoinRoomSuccess).toHaveBeenCalled();
        expect(emitUpdatePlayerList).toHaveBeenCalled();
        expect(emitJoinRoomFail).not.toHaveBeenCalled();
    });

    it("should fail if the room name is invalid", () => {
        const params = { roomName: " ", username: "Paul" };
        simulateRoomJoinEvent(params);

        expect(emitJoinRoomFail).toHaveBeenCalledWith(
            mockSocket,
            " ",
            expect.any(Error)
        );
        const error = emitJoinRoomFail.mock.calls[0][2];
        expect(error.message).toContain("invalid");
    });

    // it('should add a player when a room does already exist', () => {
    // it('should fail if a player with the same name is already connected in the room', () => {
    // it('should allow a disconnected player to reconnect with a valid token', () => {
    // it('should fail to reconnect if the token is invalid', () => {
    // it('should fail if trying to join a game that has already started', () => {
});
