import { roomJoinRoomNameCheck } from "../../utils/socket_checks.js";

export default function handleRoomJoin(socket) {
   socket.on("room_join", (params, callback) => {
      const roomName = params.roomName;

      if (roomJoinRoomNameCheck(roomName, socket) == false) {
         return callback({
            success: false,
            error: `Room name '${roomName}' is invalid.`,
         });
      }

      socket.join(roomName);

      console.log(`Client ${socket.id} joined room: ${roomName}`);
      return callback({
         success: true,
         message: `Client ${socket.id} joined room: ${roomName}`,
      });
   });
}
