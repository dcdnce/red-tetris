import Player from "../../objects/player/player.js";
import GameMapSingleton from "../../services/gameMapSingleton.js";
import Game from "../../objects/game.js";
import Logger from "../../services/logger.js";
import emitUpdatePlayerList from "../emitters/emit_update_player_list.js";
import emitJoinRoomFail from "../emitters/emit_join_room_fail.js";
import emitJoinRoomSuccess from "../emitters/emit_join_room_success.js";
import { kStartedState } from "../../objects/roomstate.js";
import Token from "../../services/token.js";

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
            } else {
                throwIfGameStarted(game);
                throwIfGameIsFull(game);
                player = new Player(username, game);
            }

            player.refreshSocket(socket, roomName);
            player.setConnected();

            emitJoinRoomSuccess(socket, player);

            emitUpdatePlayerList(player.currentGame);
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

            if (player.socket !== socket && !player.isConnected) {
                // reconnection
                Logger.info(true, game.roomName, `Reconnection👌`);
                // Reconnect player
                return true;
            }

            if (player.socket === socket && player.isConnected) {
                // second room join, confirmation
                Logger.info(true, game.roomName, `Room join confirmation 👌`);
                return true;
            }

            if (player.socket === socket && !player.isConnected) {
                // second room join, confirmation when react strict mode is slow
                Logger.info(
                    true,
                    game.roomName,
                    `Room join confirmation - room_exit arrived meantime 👌`
                );
                return true;
            }
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
            throw err;
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
