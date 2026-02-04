import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// --- IMPORTER LES MODULES ---
import handleRoomJoinRequest from "../../src/socket-events/handlers/handleRoomJoinRequest.js";
import GameMapSingleton from "../../src/services/gameMapSingleton.js";
import Game from "../../src/objects/Game.js";
import * as emitJoinRoomFailModule from "../../src/socket-events/emitters/emit_join_room_fail.js";
import * as emitJoinRoomSuccessModule from "../../src/socket-events/emitters/emit_join_room_success.js";
import * as emitUpdateGameDataModule from "../../src/socket-events/emitters/emit_update_game_data.js";
import * as emitRoomLaunchSuccessModule from "../../src/socket-events/emitters/emit_room_launch_success.js";
import * as emitRoomLaunchFailModule from "../../src/socket-events/emitters/emit_room_launch_fail.js";
import handleRoomExit from "../../src/socket-events/handlers/handleRoomExit.js";
import handleRoomLaunch from "../../src/socket-events/handlers/handleRoomLaunch.js";
import { initializeSocketIO } from "../../src/socket-events/initialize_socketio.js";

// --- MOCKING if needed ---
// vi.mock("../../src/socket-events/emitters/emit_update_player_list.js", () => ({
//     default: vi.fn(),
// }));

describe("Lobby", () => {
    let mockSocket;
    initializeSocketIO();

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
        handleRoomExit(mockSocket);
        handleRoomLaunch(mockSocket);
    });

    afterEach(() => {
        // Clean spies and mocks
        vi.clearAllMocks();
        vi.useRealTimers();
        GameMapSingleton.clear();
    });

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

    const simulateRoomJoinEvent = (params) =>
        simulateEvent("room_join", params);
    const simulateRoomExitEvent = (params) =>
        simulateEvent("room_exit", params);
    const simulateRoomLaunchEvent = (params) =>
        simulateEvent("room_launch", params);
    // const simulateDisconnectingEvent = () => simulateEvent('disconnecting');
    // const simulateExitAllEvent = () => simulateEvent('exit_all');

    // --- TESTS ---
    it("should create a new game and add a player when a room does not exist", () => {
        const emitUpdateGameDataSpy = vi.spyOn(
            emitUpdateGameDataModule,
            "default"
        );
        const emitJoinRoomFailSpy = vi.spyOn(emitJoinRoomFailModule, "default");
        const emitJoinRoomSuccessSpy = vi.spyOn(
            emitJoinRoomSuccessModule,
            "default"
        );

        expect(GameMapSingleton.has("room1")).toBe(false);
        simulateRoomJoinEvent({
            roomName: "room1",
            username: "Paul",
            token: null,
        });

        expect(GameMapSingleton.has("room1")).toBe(true);
        const game = GameMapSingleton.get("room1");
        expect(game).toBeInstanceOf(Game);
        expect(game.players.has("Paul")).toBe(true);

        expect(emitJoinRoomSuccessSpy).toHaveBeenCalled();
        expect(emitUpdateGameDataSpy).toHaveBeenCalled();
        expect(emitJoinRoomFailSpy).not.toHaveBeenCalled();
    });

    it("should fail if the room name is invalid", () => {
        const emitJoinRoomFailSpy = vi.spyOn(emitJoinRoomFailModule, "default");
        simulateRoomJoinEvent({ roomName: " ", username: "Paul" });

        const expectedError = new Error(`Room name ' ' is invalid.`);
        expect(emitJoinRoomFailSpy).toHaveBeenCalledWith(
            mockSocket,
            " ",
            expectedError
        );
    });

    it("should add a second player when a room already exist", () => {
        const emitUpdateGameDataSpy = vi.spyOn(
            emitUpdateGameDataModule,
            "default"
        );

        simulateRoomJoinEvent({
            roomName: "room1",
            username: "Paul",
            token: null,
        });
        simulateRoomJoinEvent({
            roomName: "room1",
            username: "Eric",
            token: null,
        });

        const game = GameMapSingleton.get("room1");
        expect(game.players.has("Paul")).toBe(true);
        expect(game.players.has("Eric")).toBe(true);

        expect(emitUpdateGameDataSpy).toHaveBeenCalled();
    });

    it("should fail to connect if the game is full", () => {
        const emitJoinRoomFailSpy = vi.spyOn(emitJoinRoomFailModule, "default");

        simulateRoomJoinEvent({
            roomName: "room1",
            username: "Paul",
            token: null,
        });
        simulateRoomJoinEvent({
            roomName: "room1",
            username: "Eric",
            token: null,
        });
        expect(emitJoinRoomFailSpy).not.toHaveBeenCalled();

        const expectedError = new Error("Cannot join, the lobby is full.");
        simulateRoomJoinEvent({
            roomName: "room1",
            username: "Sacha",
            token: null,
        });
        expect(emitJoinRoomFailSpy).toHaveBeenCalledWith(
            mockSocket,
            "room1",
            expectedError
        );
    });

    it("should fail if a player with the same username is already connected in the room", () => {
        const emitJoinRoomFailSpy = vi.spyOn(emitJoinRoomFailModule, "default");

        simulateRoomJoinEvent({
            roomName: "room1",
            username: "Paul",
            token: null,
        });
        simulateRoomJoinEvent({
            roomName: "room1",
            username: "Paul",
            token: null,
        });

        const expectedError = new Error(
            "A player with username 'Paul' is already registered in this room."
        );
        expect(emitJoinRoomFailSpy).toHaveBeenCalledWith(
            mockSocket,
            "room1",
            expectedError
        );
    });

    it("should definitively disconnect a player who exits a waiting room", () => {
        simulateRoomJoinEvent({
            roomName: "room1",
            username: "Paul",
            token: null,
        });
        const game = GameMapSingleton.get("room1");
        const player = game.players.get("Paul");
        mockSocket.player = player;

        expect(game.players.has("Paul")).toBe(true);

        simulateRoomExitEvent();

        expect(game.players.has("Paul")).toBe(false);
        expect(player.socket.leave).toHaveBeenCalledWith("room1");
    });

    it("should definitively delete an empty waiting room", () => {
        simulateRoomJoinEvent({
            roomName: "room1",
            username: "Paul",
            token: null,
        });
        const game = GameMapSingleton.get("room1");
        const endAndDeleteSpy = vi.spyOn(game, "endAndDelete");

        simulateRoomExitEvent();

        expect(game.players.has("Paul")).toBe(false);
        expect(endAndDeleteSpy).toHaveBeenCalled();
        expect(GameMapSingleton.has("room1")).toBe(false);
    });

    it("should fail to connect if the game is started", () => {
        const emitJoinRoomFailSpy = vi.spyOn(emitJoinRoomFailModule, "default");
        const emitRoomLaunchSuccessSpy = vi.spyOn(
            emitRoomLaunchSuccessModule,
            "default"
        );

        simulateRoomJoinEvent({
            roomName: "room1",
            username: "Paul",
            token: null,
        });
        const token = GameMapSingleton.get("room1").players.get("Paul").token;

        simulateRoomLaunchEvent({
            roomName: "room1",
            username: "Paul",
            token: token,
        });
        simulateRoomJoinEvent({
            roomName: "room1",
            username: "Eric",
            token: null,
        });

        expect(emitRoomLaunchSuccessSpy).toHaveBeenCalled();
        const expectedError = new Error("Cannot join, the game started.");
        expect(emitJoinRoomFailSpy).toHaveBeenCalledWith(
            mockSocket,
            "room1",
            expectedError
        );
    });

    it("should fail to launch if the game is started", () => {
        const emitRoomLaunchSuccessSpy = vi.spyOn(
            emitRoomLaunchSuccessModule,
            "default"
        );
        const emitRoomLaunchFailSpy = vi.spyOn(
            emitRoomLaunchFailModule,
            "default"
        );

        simulateRoomJoinEvent({
            roomName: "room1",
            username: "Paul",
            token: null,
        });
        const token = GameMapSingleton.get("room1").players.get("Paul").token;
        simulateRoomLaunchEvent({
            roomName: "room1",
            username: "Paul",
            token: token,
        });
        simulateRoomLaunchEvent({
            roomName: "room1",
            username: "Paul",
            token: token,
        });

        const expectedError = new Error(
            "Cannot launch game: room already in started state."
        );
        expect(emitRoomLaunchSuccessSpy).toHaveBeenCalledTimes(1);
        expect(emitRoomLaunchFailSpy).toHaveBeenCalledExactlyOnceWith(
            mockSocket,
            expectedError
        );
    });

    it("should fail to launch if not game leader", () => {
        const emitRoomLaunchSuccessSpy = vi.spyOn(
            emitRoomLaunchSuccessModule,
            "default"
        );
        const emitRoomLaunchFailSpy = vi.spyOn(
            emitRoomLaunchFailModule,
            "default"
        );

        simulateRoomJoinEvent({
            roomName: "room1",
            username: "Paul",
            token: null,
        });
        simulateRoomJoinEvent({
            roomName: "room1",
            username: "Eric",
            token: null,
        });
        const token = GameMapSingleton.get("room1").players.get("Eric").token;
        simulateRoomLaunchEvent({
            roomName: "room1",
            username: "Eric",
            token: token,
        });
        const expectedError = new Error(
            "Cannot launch game: 'Eric' isn't room leader."
        );
        expect(emitRoomLaunchSuccessSpy).not.toHaveBeenCalled();
        expect(emitRoomLaunchFailSpy).toHaveBeenCalledExactlyOnceWith(
            mockSocket,
            expectedError
        );
    });

    it("should allow a player to reconnect with a valid token", () => {
        const emitJoinRoomSuccessSpy = vi.spyOn(
            emitJoinRoomSuccessModule,
            "default"
        );
        const emitUpdateGameDataSpy = vi.spyOn(
            emitUpdateGameDataModule,
            "default"
        );
        const emitRoomLaunchSuccessSpy = vi.spyOn(
            emitRoomLaunchSuccessModule,
            "default"
        );

        simulateRoomJoinEvent({
            roomName: "room1",
            username: "Paul",
            token: null,
        });
        let token = GameMapSingleton.get("room1").players.get("Paul").token;
        simulateRoomLaunchEvent({
            roomName: "room1",
            username: "Paul",
            token: token,
        });
        simulateRoomExitEvent();
        simulateRoomJoinEvent({
            roomName: "room1",
            username: "Paul",
            token: token,
        });

        expect(emitRoomLaunchSuccessSpy).toHaveBeenCalled();
        expect(emitUpdateGameDataSpy).toHaveBeenCalled(); // at roomExitEvent
        expect(emitJoinRoomSuccessSpy).toHaveBeenCalledTimes(2);
    });

    it("should fail to reconnect if the token is invalid", () => {
        const emitJoinRoomFailSpy = vi.spyOn(emitJoinRoomFailModule, "default");
        const emitJoinRoomSuccessSpy = vi.spyOn(
            emitJoinRoomSuccessModule,
            "default"
        );
        const emitRoomLaunchSuccessSpy = vi.spyOn(
            emitRoomLaunchSuccessModule,
            "default"
        );

        simulateRoomJoinEvent({
            roomName: "room1",
            username: "Paul",
            token: null,
        });
        let token = GameMapSingleton.get("room1").players.get("Paul").token;
        simulateRoomLaunchEvent({
            roomName: "room1",
            username: "Paul",
            token: token,
        });
        token += "bruh";
        simulateRoomExitEvent();
        simulateRoomJoinEvent({
            roomName: "room1",
            username: "Paul",
            token: token,
        });

        expect(emitRoomLaunchSuccessSpy).toHaveBeenCalled();
        expect(emitJoinRoomSuccessSpy).toHaveBeenCalledTimes(1);
        const expectedError = new Error("Invalid token signature.");
        expect(emitJoinRoomFailSpy).toHaveBeenCalledWith(
            mockSocket,
            "room1",
            expectedError
        );
    });

    // TODO
    // Game class unit test =>
    // it('should change game leader if the latter is disconnected', () => {
    // it('should definitively disconnects a player after 10 seconds', () => {
});
