import Logger from "../../utils/logger.js";
import { ioServer } from "../../index.js";

export default function emitUpdatePlayerList(game) {
   Logger.info(
      true,
      `Update player list for room ${game.roomName}`
   );

   ioServer.to(game.roomName).emit("update_player_list", {
      message: `Update player list for room ${game.roomName}`,
      playersInRoom: game.getPlayerListForClient(),
   });
}
