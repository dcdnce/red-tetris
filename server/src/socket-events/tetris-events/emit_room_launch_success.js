import Logger from "../../utils/logger.js";
import { SocketManager } from "../../socketManager.js";

export default function emitRoomLaunchSuccess(player, game) {
    const message = `🚀 Player ${player.username} launchs room ${game.roomName}`;

    Logger.info(true, null, message);

    const io = SocketManager.getIO();

    ioServer.to(game.roomName).emit("room_launch_success", {
        roomName: game.roomName,
        message: message,
    });
}
