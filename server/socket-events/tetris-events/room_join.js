import ActivePlayersSingleton from "../../objects/activePlayersSingleton.js";
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

      try {
         roomNameCheck(roomName);

         activePlayersCheck(username);

         // Player doesn't exist
         //   - Create player
         // TODO -> send back a token
         let player = new Player(username, socket);

         gameRoomConnectionOrCreation(roomName, player);

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

function activePlayersCheck(username) {
   const activePlayers = new ActivePlayersSingleton();

   // Logs
   Logger.info(
      true,
      `ActivePlayers has ${username} == ${activePlayers.has(username)}`
   );

   // Player exist
   //   - Return error -> already connected somewhere
   // TODO -> check token to handle reconnection
   if (activePlayers.has(username) === true) {
      throw new Error(
         `Player '${username}' is already registered somewhere in an other room.`
      );
   }
}

function gameRoomConnectionOrCreation(roomName, player) {
   const gameMap = new GameMapSingleton();

   let game = null;

   // Room exist (later check room state, pending, launched, etc)
   // Retrieve room
   // ADD PLAYER
   if (gameMap.has(roomName) == true) {
      game = gameMap.get(roomName);
   }

   // Room doesn't exist
   // Create room
   // ADD PLAYER
   if (gameMap.has(roomName) == false) {
      game = new Game(roomName);
   }

   player.socket.join(roomName); // socketio room
   game.players.set(player.username, player);
   player.currentGame = game;
}
