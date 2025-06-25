import ActivePlayersSingleton from "../../objects/activePlayersSingleton.js";
import GameMapSingleton from "../../objects/gameMapSingleton.js";

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
      }

      // Player deletion
         // always for now
         // TODO -> handle reconnection with token
      delete activePlayers.delete(username);

      socket.leave(currentGameRoomName);

      console.log(`Client ${username} exited room: ${currentGameRoomName}`);
   });
}
