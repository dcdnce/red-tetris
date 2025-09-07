import Logger from "../../utils/logger.js";
import { ioServer } from "../../index.js";

export default function emitRoomLaunchSuccess(player, game) {
    const message = `🚀 Player ${player.username} launchs room ${game.roomName}`;

    Logger.info(true, message);

    ioServer.to(game.roomName).emit("room_launch_success", {
        message: message,
    });
}
