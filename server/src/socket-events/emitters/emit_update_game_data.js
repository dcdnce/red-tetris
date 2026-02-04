import Logger from "../../services/logger.js";
import { GameMapper } from "../../services/mappers/GameMapper.js";
import { SocketManager } from "../../services/socketManager.js";

export default function emitUpdateGameData(game) {
    // Logger.info(true, game.roomName, `Update game data`);

    const io = SocketManager.getIO();

    io.to(game.roomName).emit("update_game_data", {
        message: `Update game data for room ${game.roomName}`,
        roomName: game.roomName,
        roomState: game.getState(),
        winnerUsername: game.winnerUsername,
        players: GameMapper.getPlayerList(game),
    });
}
