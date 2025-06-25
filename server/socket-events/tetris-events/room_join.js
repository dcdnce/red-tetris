import { roomJoinRoomNameCheck } from "../../utils/socket_checks.js";
import ActivePlayersSingleton from "../../objects/activePlayersSingleton.js";
import Player from "../../objects/player.js";
import GameMapSingleton from "../../objects/gameMapSingleton.js";
import Game from "../../objects/game.js";
import { use } from "react";
import { io } from "socket.io-client";

export default function handleRoomJoinRequest(socket) {
   socket.on("room_join", (params, callback) => {
      const roomName = params.roomName;
      const username = params.username;
      const activePlayers = new ActivePlayersSingleton();
      const gameMap = new GameMapSingleton();

      if (roomJoinRoomNameCheck(roomName, socket) == false) {
         return callback({
            success: false,
            error: `Room name '${roomName}' is invalid.`,
         });
      }

      // ACTIVE PLAYERS CHECK
         // Player doesn't exist
            // Create player
            // TODO -> send back a token
            // => ACTIVE ROOM CHECK
         // Player exist
            // Return error -> already connected somewhere
            // TODO -> check token to handle reconnection
            // => ACTIVE ROOM CHECK

      let player = null;
      console.log(`ActivePlayers has ${username} == ${activePlayers.has(username)}`);
      if (activePlayers.has(username) === true) {
         player = activePlayers.get(username);

         return callback({
            success: false,
            error: `Player '${username}' is already registered somewhere in an other room.`,
         });
      }
      
      if (activePlayers.has(username) === false) {
         player = new Player(username);
      }
      
      // => we have a Player, that wants to connect to a room
      // ACTIVE ROOM CHECK
         // Room exist (later check room state, pending, launched, etc)
            // Retrieve room
            // ADD PLAYER
         // Room doesn't exist
            // Create room
            // ADD PLAYER
         

      let game = null;
      if (gameMap.has(roomName) == true) {
         game = gameMap.get(roomName);
      }

      if (gameMap.has(roomName) == false) {
         game = new Game(roomName);
      }

      player.currentGameRoomName = roomName;
      game.players.set(username, player);
      socket.join(roomName);

      console.log(`Client ${username} joined room: ${roomName}`);

      socket.emit('join_room_success', {
         message: `Client ${username} joined room: ${roomName}`,
         // initialGameState
         username: player.username,
         roomName: game.roomName,
         playersInRoom: game.getPlayerListForClient()
      });

      socket.to(roomName).emit('update_player_list', {
         message: `Client ${username} joined room: ${roomName}`,
         playersInRoom: game.getPlayerListForClient()
      });
   });
}
