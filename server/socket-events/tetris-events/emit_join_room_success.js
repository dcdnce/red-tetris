import Logger from "../../utils/logger.js";

export default function emitJoinRoomSuccess(socket, player) {
    Logger.info(
        true,
        `Client ${player.username} joined room: ${player.currentGame.roomName}`
    );

    socket.emit("join_room_success", {
        message: `Client ${socket.username} joined room: ${player.currentGame.roomName}`,
        // initialGameState
        username: player.username,
        roomName: player.currentGame.roomName,
        players: player.currentGame.getPlayerListForClient(),
        token: player.token,
    });
}
