import { roomJoinRoomNameCheck } from "../../utils/socket_checks.js";
import ActivePlayersSingleton from "../../objects/activePlayersSingleton.js";
import Player from "../../objects/player.js";
import GameMapSingleton from "../../objects/gameMapSingleton.js";
import Game from "../../objects/game.js";
import { use } from "react";

export default function handleRoomJoinRequest(socket) {
   socket.on("room_join", (params, callback) => {
      const roomName = params.roomName;
      const username = params.username;
      activePlayers = new ActivePlayersSingleton();
      gameMap = new GameMapSingleton();

      if (roomJoinRoomNameCheck(roomName, socket) == false) {
         return callback({
            success: false,
            error: `Room name '${roomName}' is invalid.`,
         });
      }

      // ACTIVE PLAYERS CHECK
         // Player doesn't exist
            // Create player
            // => ACTIVE ROOM CHECK
         // Player exist
            // Check socket id
               // Different => fuck off (connected to a room)
               // Null => welcome back
                  // => ACTIVE ROOM CHECK

      let player = null;
      if (activePlayers.has(username) === true) {
         player = activePlayers.get(username);

         if (player.currentSocketId !== null) {
            return callback({
               success: false,
               error: `Player '${username}' is already connected somewhere.`,
            });
         }

         if (player.currentSocketId === socket.id) {
            return callback({
               success: true,
               message: `Client ${username} joined room: ${roomName}`,
            });
         }
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

      player.currentSocketId = socket.id;
      player.currentGameRoomName = roomName;
      game.players.set(username, player);


      console.log(`Client ${username} can join room: ${roomName}`);
      return callback({
         success: true,
         message: `Client ${username} can join room: ${roomName}`,
      });
   });
}
