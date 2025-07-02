import jwt from "jsonwebtoken";
import dotenv from "dotenv";

class Token {
   constructor(username) {
      this.token = jwt.sign({ username }, process.env.TOKEN_SECRET, {
         expiresIn: "1h",
      });
   }
}

export default Token;
