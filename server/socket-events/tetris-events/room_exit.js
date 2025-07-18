import GameMapSingleton from "../../objects/gameMapSingleton.js";
import Logger from "./../../utils/logger.js";
import emitUpdatePlayerList from "./emit_update_player_list.js";

export default function handleRoomExit(socket) {
   const gameMap = new GameMapSingleton();

   const cleanupPlayer = (player) => {
      if (!player) return;

      const roomName = player.currentGame.roomName;
      const game = player.currentGame;
      game.players.delete(player.username);

      // Last player ?
      if (game.players.size === 0) {
         gameMap.delete(roomName);
         Logger.info(true, `Deleting room: ${roomName}, last player left.`);
      }

      // Player deletion
      // always for now
      // TODO -> handle reconnection with token
      socket.leave(roomName); // Leave socket.io room
      socket.username = null;
      socket.player = null;
      emitUpdatePlayerList(game);

      Logger.info(true, `Client ${player.username} exited room: ${roomName}`);
   };

   socket.on("room_exit", () => {
      // If socket has no username => nothing to clean
      cleanupPlayer(socket.player);
   });

   socket.on("disconnecting", () => {
      // If socket has no username => nothing to clean
      cleanupPlayer(socket.player);
   });
}
