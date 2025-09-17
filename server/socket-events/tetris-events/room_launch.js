import GameMapSingleton from "../../objects/gameMapSingleton.js";
import Logger from "../../utils/logger.js";
import emitRoomLaunchFail from "./emit_room_launch_fail.js";
import Token from "../../services/token.js";
import emitRoomLaunchSuccess from "./emit_room_launch_success.js";
import { kStartedState } from "../../objects/roomstate.js";

export default function handleRoomLaunch(socket) {
    const gameMapSingletonInstance = new GameMapSingleton();

    const canLaunchGame = (game, player) => {
        // Verify party leader
        if (game.leaderToken !== player.token) {
            throw new Error(
                `Cannot launch room : '${player.username}' isn't room leader.`
            );
        }

        // Verify game is not launched
        if (game.getState() === kStartedState) {
            throw new Error(
                `Cannot launch room : room already in started state.`
            );
        }
    };

    socket.on("room_launch", (params) => {
        // Try block needs to be inside callback, otherwise won't be effective.
        try {
            const roomName = params.roomName;
            const username = params.username;
            const token = params.token;
            const game = gameMapSingletonInstance.get(roomName);
            const player = game.players.get(username);

            // Verify token
            Token.verify(token, player);

            // Verify can launch game
            canLaunchGame(game, player);

            // Launch game
            game.startGame();
            emitRoomLaunchSuccess(player, game);
        } catch (error) {
            Logger.error(false, error.stack);
            emitRoomLaunchFail(socket, error);
        }
    });
}
