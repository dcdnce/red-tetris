//import Game from "./game";

class GameMapSingleton {
   constructor() {
      if (GameMapSingleton._instance) {
         return GameMapSingleton._instance;
      }
      GameMapSingleton._instance = this;

      this.container = new Map(); // <roomName, Game>
   }

   get(key) {
      return this.container.get(key);
   }

   has(key) {
      return this.container.has(key);
   }

   delete(key) {
      return this.container.delete(key);
   }

   set(key, value) {
      this.container.set(key, value);
   }
}

export default GameMapSingleton;
