import GameMapSingleton from "../../objects/gameMapSingleton.js";
import Logger from "./../../utils/logger.js";
import emitUpdatePlayerList from "./emit_update_player_list.js";

export default function handleRoomExit(socket) {
   const gameMap = new GameMapSingleton();

   const cleanupPlayer = (player) => {
      if (!player) return;

      const roomName = player.currentGame.roomName;
      const game = player.currentGame;

      // Last player ?
      if (game.players.size === 1) {
         game.players.delete(player.username);
         gameMap.delete(roomName);
         Logger.info(true, `Deleting room: ${roomName}, last player left.`);
      }

      // Temporary disconnection
      socket.leave(roomName); // Leave socket.io room
      socket.player = null;
      player.isConnected = false;

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

   socket.on("exit_all", () => {
      try {
         const gameMap = new GameMapSingleton();
         const roomCount = gameMap.container.size;

         // Supprimer toutes les rooms
         gameMap.container.clear();

         Logger.info(true, `All ${roomCount} rooms have been deleted`);

         // Optionnel : Déconnecter tous les sockets de toutes les rooms
         socket.broadcast.emit("all_rooms_cleared");
      } catch (error) {
         Logger.error(true, `Error clearing all rooms: ${error.message}`);
      }
   });
}
