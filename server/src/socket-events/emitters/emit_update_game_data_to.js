import Logger from "../../services/logger.js";

export default function emitUpdateGameDataTo(player, game) {
    Logger.info(true, game.roomName, `Update game data to specific client`);

    player.socket.emit("update_game_data", {
        message: `Update game data list for room ${game.roomName}`,
        roomName: game.roomName,
        roomState: game.getState(),
        players: game.getPlayerListForClient(),
    });
}
