import Player from "../../objects/player.js";
import GameMapSingleton from "../../objects/gameMapSingleton.js";
import Game from "../../objects/game.js";
import Logger from "../../utils/logger.js";
import emitUpdatePlayerList from "./emit_update_player_list.js";
import emitJoinRoomFail from "./emit_join_room_fail.js";
import emitJoinRoomSuccess from "./emit_join_room_success.js";

export default function handleRoomJoinRequest(socket) {
   socket.on("room_join", (params) => {
      const roomName = params.roomName;
      const username = params.username;
      const token = params.token;
      Logger.info(true, `Received token: ${token}`);
      const gameMap = new GameMapSingleton();

      try {
         roomNameCheck(roomName);

         if (isGameRoomCreationNeeded(roomName)) {
            new Game(roomName);
         }

         let game = gameMap.get(roomName);
         let player = null;

         if (playerIsReconnecting(game, username, token, socket)) {
            player = game.players.get(username);
         } else {
            player = new Player(username, game);
         }

         player.refreshSocket(socket, roomName);

         emitJoinRoomSuccess(socket, player);

         emitUpdatePlayerList(player.currentGame);
      } catch (error) {
         Logger.error(true, error.stack);
         emitJoinRoomFail(socket, error);
      }
   });
}

function roomNameCheck(roomName) {
   if (
      typeof roomName !== "string" ||
      !roomName.trim().length ||
      roomName.trim().length > 5
   ) {
      throw new Error(`Room name '${roomName}' is invalid.`);
   }
}

function isGameRoomCreationNeeded(roomName) {
   const gameMap = new GameMapSingleton();

   if (gameMap.has(roomName) == true) {
      return false;
   }

   return true;
}

function playerIsReconnecting(game, username, token, socket) {
   // Logs
   Logger.info(
      true,
      `Room ${game.roomName} has ${username} == ${game.players.has(username)}`
   );

   // Check token to handle reconnection
   if (game.players.has(username) === true) {
      //exists in room
      let player = game.players.get(username);

      if (
         token === player.token &&
         player.socket !== socket &&
         !player.isConnected
      ) {
         // reconnection
         Logger.info(true, `Reconnection👌`);
         // Reconnect player
         return true;
      }

      if (
         token === player.token &&
         player.socket === socket &&
         player.isConnected
      ) {
         // second room join, confirmation
         Logger.info(true, `Room join confirmation 👌`);
         return true;
      }

      if (
         token === player.token &&
         player.socket === socket &&
         !player.isConnected
      ) {
         // second room join, confirmation when react strict mode is slow
         Logger.info(
            true,
            `Room join confirmation - room_exit arrived meantime 👌`
         );
         return true;
      }

      // Logger.info(true, `token == player.token : ${token === player.token}\nsocket === player.socket : ${socket === player.socket}\nplayer.isConnected : ${player.isConnected}`);

      throw new Error(
         `A player with '${username}' is already registered in this room.`
      );
   }

   return false;
}
