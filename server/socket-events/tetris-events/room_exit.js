import ActivePlayersSingleton from "../../objects/activePlayersSingleton.js";
import GameMapSingleton from "../../objects/gameMapSingleton.js";
import Logger from "./../../utils/logger.js";

export default function handleRoomExit(socket) {
   const activePlayers = new ActivePlayersSingleton();
   const gameMap = new GameMapSingleton();

   const cleanupPlayer = (username) => {
      const player = activePlayers.get(username);
      if (!player) return;

      const roomName = player.currentGame.roomName;
      const game = gameMap.get(roomName);
      if (game) {
         delete game.players[username];

         // Game deletion if last player
         if (game.players.size === 0) {
            gameMap.delete(roomName);
            Logger.info(true, `Deleting room: ${roomName}, last player left.`);
         }
      }

      // Player deletion
      // always for now
      // TODO -> handle reconnection with token
      activePlayers.delete(username);
      socket.leave(roomName); // Leave socket.io room
      socket.username = null;

      Logger.info(true, `Client ${username} exited room: ${roomName}`);
   };

   socket.on("room_exit", () => {
      // If socket has no username => nothing to clean
      const username = socket.username;
      cleanupPlayer(username);
   });

   socket.on("disconnecting", () => {
      // If socket has no username => nothing to clean
      const username = socket.username;
      if (username) {
         cleanupPlayer(username);
      }
   });
}
