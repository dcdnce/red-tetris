import Logger from "../../utils/logger.js";

export default function emitJoinRoomFail(socket, error) {
    socket.emit("join_room_failed", {
        success: false,
        error: error.message,
    });
}
