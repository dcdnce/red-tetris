export default function emitJoinRoomFail(socket, roomName, error) {
    socket.emit("join_room_failed", {
        success: false,
        roomName: roomName,
        error: error.message,
    });
}
