import ActivePlayersSingleton from "../../objects/activePlayersSingleton.js";
import GameMapSingleton from "../../objects/gameMapSingleton.js";
import Logger from "./../../utils/logger.js"

export default function handleRoomExit(socket) {
   socket.on("room_exit", (params) => {
      const username = params.username;
      const activePlayers = new ActivePlayersSingleton();
      const gameMap = new GameMapSingleton();

      if (activePlayers.get(username) === undefined)
               return;

      // Game deletion
         // if last player
      let currentGameRoomName = activePlayers.get(username).currentGameRoomName;
      let currentGame = gameMap.get(currentGameRoomName);
      delete currentGame.players[username]
      
      if (currentGame.players.size === 0) {
         gameMap.delete(currentGame)
         Logger.debug(`Deleting room: ${currentGameRoomName}, last player left.`);
      }

      // Player deletion
         // always for now
         // TODO -> handle reconnection with token
      delete activePlayers.delete(username);

      socket.leave(currentGameRoomName); // Leave socket.io room

      Logger.debug(`Client ${username} exited room: ${currentGameRoomName}`);
   });
}
