export default function emitRoomLaunchFail(socket, error) {
   socket.emit("room_launch_failed", {
      error: error.message,
   });
}
