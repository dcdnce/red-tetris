import Logger from "../../utils/logger.js";
import { ioServer } from "../../index.js";

export default function emitUpdateGameData(game) {
    Logger.info(true, game.roomName, `Update game data`);

    ioServer.to(game.roomName).emit("update_game_data", {
        message: `Update game data list for room ${game.roomName}`,
        roomName: game.roomName,
        roomState: game.getState(),
        players: game.getPlayerListForClient(),
    });
}
