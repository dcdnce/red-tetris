import { roomJoinRoomNameCheck } from "../../utils/socket_checks.js";

export default function handleRoomJoinRequest(socket) {
   socket.on("room_join_request", (params, callback) => {
      const roomName = params.roomName;
      const username = params.username;

      if (roomJoinRoomNameCheck(roomName, socket) == false) {
         return callback({
            success: false,
            error: `Room name '${roomName}' is invalid.`,
         });
      }

      console.log(`Client ${username} can join room: ${roomName}`);
      return callback({
         success: true,
         message: `Client ${username} can join room: ${roomName}`,
      });
   });
}
