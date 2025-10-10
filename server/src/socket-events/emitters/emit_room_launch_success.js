import Logger from "../../services/logger.js";
import { SocketManager } from "../../services/socketManager.js";

export default function emitRoomLaunchSuccess(player, game) {
    const message = `🚀 Player ${player.username} launchs room ${game.roomName}`;

    Logger.info(true, null, message);

    const io = SocketManager.getIO();

    io.to(game.roomName).emit("room_launch_success", {
        roomName: game.roomName,
        message: message,
    });
}
