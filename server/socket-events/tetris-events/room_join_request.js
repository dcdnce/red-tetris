import { roomJoinRoomNameCheck } from "../../utils/socket_checks.js";

export default function handleRoomJoinRequest(socket) {
   socket.on("room_join_request", (params, callback) => {
      const roomName = params.roomName;

      if (roomJoinRoomNameCheck(roomName, socket) == false) {
         return callback({
            success: false,
            error: `Room name '${roomName}' is invalid.`,
         });
      }

      console.log(`Client ${socket.id} can join room: ${roomName}`);
      return callback({
         success: true,
         message: `Client ${socket.id} can join room: ${roomName}`,
      });
   });
}
