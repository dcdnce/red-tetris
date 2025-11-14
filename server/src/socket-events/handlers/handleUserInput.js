import Logger from "../../services/logger.js";
import Token from "../../services/token.js";
import GameMapSingleton from "../../services/gameMapSingleton.js";
import { kStartedState } from "../../objects/roomstate.js";

export default function handleUserInput(socket) {
    socket.on("user_input", (params) => {
        try {
            const roomName = params.roomName;
            const username = params.username;
            const token = params.token;
            const input = params.key;
            const game = GameMapSingleton.get(roomName);
            const player = game.players.get(username);

            if (!roomName || !username || !input) {
                Logger.warning(
                    false,
                    null,
                    "user_input called with invalid parameters"
                );
                return;
            }

            // Verify game started
            if (game.getState() !== kStartedState) {
                Logger.warning(
                    false,
                    null,
                    "Cannot register input, game's not running"
                );
                return;
            }

            // Verify token
            Token.verify(token, player);

            game.handleInput(player, input);
        } catch (error) {
            Logger.error(false, error.stack);
        }
    });
}
