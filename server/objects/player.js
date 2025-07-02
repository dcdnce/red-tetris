import ActivePlayersSingleton from "./activePlayersSingleton.js";
import Token from "./token.js";

class Player {
   constructor(username, socket) {
      this.username = username;
      this.socket = socket;
      socket.username = username; // !Important - if socket has no username it won't clean the room at exit time.
      // this.userId = generateUserId()
      // this.lastSeen  === null
      this.currentGame = null;
      this.board = this.createEmptyBoard();
      // this.token = new Token(username).token;
      // console.log(`Player created: ${username} with token: ${this.token}`);
      const activePlayers = new ActivePlayersSingleton();
      activePlayers.set(username, this);
   }

   createEmptyBoard() {
      return [
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
         [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      ];
   }
}

export default Player;
