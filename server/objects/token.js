import jwt from "jsonwebtoken";
import Logger from "../utils/logger.js";

class Token {
   constructor(username, roomName) {
      this.token = jwt.sign({ username, roomName }, process.env.TOKEN_SECRET, {
         expiresIn: "1h",
      });
      Logger.info(true, `Player created: ${username} with token: ${this.token}`);
   }
}

export default Token;
