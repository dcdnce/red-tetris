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
      const gameMap = new GameMapSingleton();

      try {
         roomNameCheck(roomName);

         gameRoomConnectionOrCreation(roomName, username);

         let game = gameMap.get(roomName);

         let player = new Player(username, socket, game);
         player.socket.join(roomName); // socketio room
         game.players.set(player.username, player);
         socket.player = player; // !Important - if socket has no player it won't clean the room at exit time.

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

function gameRoomConnectionOrCreation(roomName, username) {
   const gameMap = new GameMapSingleton();

   let game = null;

   // Room exist (later check room state, pending, launched, etc)
   // Retrieve room
   // ADD PLAYER
   if (gameMap.has(roomName) == true) {
      game = gameMap.get(roomName);
      playerExistsInRoomCheck(game, username)
   }

   // Room doesn't exist
   // Create room
   // ADD PLAYER
   if (gameMap.has(roomName) == false) {
      game = new Game(roomName);
   }

}

function playerExistsInRoomCheck(game, username) {
   // Logs
   Logger.info(
      true,
      `Room ${game.roomName} has ${username} == ${game.players.has(username)}`
   );

   // Player exist
   //   - Return error -> already taken
   // TODO -> check token to handle reconnection
   if (game.players.has(username) === true) {
      throw new Error(
         `Player '${username}' is already registered in this room.`
      );
   }
}
