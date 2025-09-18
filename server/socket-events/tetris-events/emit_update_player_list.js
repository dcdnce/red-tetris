import Logger from "../../utils/logger.js";
import { ioServer } from "../../index.js";

export default function emitUpdatePlayerList(game) {
    Logger.info(true, game.roomName, `Update player list`);

    ioServer.to(game.roomName).emit("update_player_list", {
        message: `Update player list for room ${game.roomName}`,
        roomState: game.getState(),
        roomName: game.roomName,
        players: game.getPlayerListForClient(),
    });
}
