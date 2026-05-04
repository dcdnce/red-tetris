import Player from "../../objects/player/player.js";
import GameMapSingleton from "../../services/gameMapSingleton.js";
import Game from "../../objects/Game.js";
import Logger from "../../services/logger.js";
import emitJoinRoomFail from "../emitters/emit_join_room_fail.js";
import emitJoinRoomSuccess from "../emitters/emit_join_room_success.js";
import { kStartedState } from "../../objects/GameState.js";
import Token from "../../services/token.js";
import emitUpdateGameData from "../emitters/emit_update_game_data.js";

export default function handleRoomJoinRequest(socket) {
    socket.on("room_join", (params) => {
        const roomName = params.roomName;
        const username = params.username;
        const token = params.token;
        try {
            if (!roomName || !username) {
                Logger.warning(
                    false,
                    null,
                    "room_join called with invalid parameters"
                );
                return;
            }

            roomNameCheck(roomName);

            createGameRoomIfNeeded(roomName);

            let game = GameMapSingleton.get(roomName);
            let player = null;

            if (playerIsReconnecting(game, username, token, socket)) {
                player = game.players.get(username);
                if (!player) return;
            } else {
                throwIfGameStarted(game);
                throwIfGameIsFull(game);
                player = new Player(username, game);
            }

            player.refreshSocket(socket, roomName);
            player.setConnected();

            emitJoinRoomSuccess(socket, player);

            emitUpdateGameData(player.currentGame);
        } catch (error) {
            Logger.error(false, error.stack);
            emitJoinRoomFail(socket, roomName, error);
        }
    });
}

function roomNameCheck(roomName) {
    if (
        typeof roomName !== "string" ||
        !roomName.trim().length ||
        roomName.trim().length > 5
    ) {
        throw new Error(`Room name '${roomName}' is invalid.`);
    }
}

function createGameRoomIfNeeded(roomName) {
    if (GameMapSingleton.has(roomName) == false) {
        new Game(roomName);
    }
}

function playerIsReconnecting(game, username, token, socket) {
    // Logs
    Logger.info(
        true,
        game.roomName,
        `Room has ${username} ? : ${game.players.has(username)}`
    );

    // Check token to handle reconnection
    if (game.players.has(username) === true) {
        //exists in room
        let player = game.players.get(username);

        try {
            Token.verify(token, player);

            const oldSocket = player.socket;

            // Reconnection
            if (!player.isConnected) {
                Logger.info(true, game.roomName, `Reconnection👌`);
                // Reconnect player
                return true;
            }

            // Second room join, confirmation
            if (oldSocket.id === socket.id && player.isConnected) {
                Logger.info(
                    true,
                    game.roomName,
                    `Room join confirmation on the same socket 👌`
                );
                return true;
            }

            // Takeover
            if (oldSocket.id !== socket.id && player.isConnected) {
                Logger.warning(
                    true,
                    game.roomName,
                    `Player '${username}' is taking over session. Old socket (${oldSocket.id}) will be disconnected.`
                );

                oldSocket.player = null; // Prevent disconnecting event from triggering cleanup
                oldSocket.leave(game.roomName);
                oldSocket.disconnect(true);
                return true;
            }

            throw new Error(`You're already connected to this game.`);
        } catch (err) {
            if (
                err.name === "JsonWebTokenError" &&
                err.message === "jwt must be provided"
            ) {
                throw new Error(
                    `A player with username '${username}' is already registered in this room.`
                );
            }
            if (
                err.name === "JsonWebTokenError" &&
                err.message === "invalid signature"
            ) {
                throw new Error(`Invalid token signature.`);
            }
            throw new Error(err);
        }
    }

    return false;
}

function throwIfGameStarted(game) {
    if (game.getState() == kStartedState) {
        throw new Error("Cannot join, the game started.");
    }
}

function throwIfGameIsFull(game) {
    if (game.players.size == 2) {
        throw new Error("Cannot join, the lobby is full.");
    }
}
