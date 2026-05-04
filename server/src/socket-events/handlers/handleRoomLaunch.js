import GameMapSingleton from "../../services/gameMapSingleton.js";
import Logger from "../../services/logger.js";
import emitRoomLaunchFail from "../emitters/emit_room_launch_fail.js";
import Token from "../../services/token.js";
import emitRoomLaunchSuccess from "../emitters/emit_room_launch_success.js";
import {
    kFinishedState,
    kPendingState,
    kStartedState,
} from "../../objects/GameState.js";

export default function handleRoomLaunch(socket) {
    const canLaunchGame = (game, player) => {
        const state = game.getState();
        if (state === kStartedState) {
            throw new Error(
                `Cannot launch game: room already in started state.`
            );
        }

        if (state !== kPendingState && state !== kFinishedState) {
            throw new Error(`Cannot launch game from state '${state}'.`);
        }

        if (game.leaderToken !== player.token) {
            throw new Error(
                `Cannot launch game: '${player.username}' isn't room leader.`
            );
        }
    };

    socket.on("room_launch", (params) => {
        // Try block needs to be inside callback, otherwise won't be effective.
        try {
            const roomName = params.roomName;
            const username = params.username;
            const token = params.token;
            const game = GameMapSingleton.get(roomName);
            if (!game) {
                throw new Error(`Room '${roomName}' not found.`);
            }
            const player = game.players.get(username);
            if (!player) {
                throw new Error(`Player '${username}' is not in this room.`);
            }

            if (!roomName || !username) {
                Logger.warning(
                    false,
                    null,
                    "room_launch called with invalid parameters"
                );
                return;
            }

            // Verify token
            Token.verify(token, player);

            // Verify can launch game
            canLaunchGame(game, player);

            // Launch game
            if (game.getState() === kFinishedState) {
                game.restartGame();
            } else {
                game.startGame();
            }
            emitRoomLaunchSuccess(player, game);
        } catch (error) {
            Logger.error(false, error.stack);
            emitRoomLaunchFail(socket, error);
        }
    });
}
