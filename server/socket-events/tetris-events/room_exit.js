export default function handleRoomExit(socket) {
   socket.on("room_exit", () => {


      console.log(`Client ${socket.id} exited room: ${joinedRoom}`);
   });
}
