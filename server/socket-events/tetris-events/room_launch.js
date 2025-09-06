import GameMapSingleton from "../../objects/gameMapSingleton.js";
import Logger from "../../utils/logger.js";
import emitRoomLaunchFail from "./emit_room_launch_fail.js";

export default function handleRoomLaunch(socket) {
   const gameMap = new GameMapSingleton();

   const launchGame = (player, game) => {
      Logger.info(
         true,
         `🚀 Player ${player.username} launchs room ${game.roomName}`
      );
   };

   const canLaunchGame = (game, player) => {
      // Verify party leader
      if (game.leaderToken !== player.token) {
         throw new Error(
            `Cannot launch room : '${player.username}' isn't room leader.`
         );
      }

      // TODO verify game is not launched
   };

   socket.on("room_launch", (params) => {
      // Try block needs to be inside callback, otherwise won't be effective.
      try {
         const roomName = params.roomName;
         const username = params.username;
         const token = params.token;
         const game = gameMap.get(roomName);
         const player = game.players.get(username);

         // TODO verify token

         // Verify can launch game
         canLaunchGame(game, player);

         // Launch game
         launchGame(player, game);
      } catch (error) {
         Logger.error(false, error.stack);
         emitRoomLaunchFail(socket, error);
      }
   });
}
