import Logger from "../../utils/logger.js";

export default function emitUpdatePlayerList(socket, player) {
   Logger.info(
      true,
      `Update player list for room ${player.currentGame.roomName}`
   );

   socket.to(player.currentGame.roomName).emit("update_player_list", {
      message: `Client ${socket.username} joined room: ${player.currentGame.roomName}`,
      playersInRoom: player.currentGame.getPlayerListForClient(),
   });
}
