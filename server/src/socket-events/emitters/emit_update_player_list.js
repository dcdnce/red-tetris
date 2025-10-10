import Logger from "../../services/logger.js";
import { SocketManager } from "../../services/socketManager.js";

export default function emitUpdatePlayerList(game) {
    Logger.info(true, game.roomName, `Update player list`);

    const io = SocketManager.getIO();

    io.to(game.roomName).emit("update_player_list", {
        message: `Update player list for room ${game.roomName}`,
        roomState: game.getState(),
        roomName: game.roomName,
        players: game.getPlayerListForClient(),
    });
}
