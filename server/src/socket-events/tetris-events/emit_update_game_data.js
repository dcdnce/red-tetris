import Logger from "../../utils/logger.js";
import { SocketManager } from "../../socketManager.js";

export default function emitUpdateGameData(game) {
    Logger.info(true, game.roomName, `Update game data`);

    const io = SocketManager.getIO();

    io.to(game.roomName).emit("update_game_data", {
        message: `Update game data list for room ${game.roomName}`,
        roomName: game.roomName,
        roomState: game.getState(),
        players: game.getPlayerListForClient(),
    });
}
