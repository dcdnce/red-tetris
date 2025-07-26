export default class Logger {
   constructor() {
      throw new Error("Logger cannot be instanciate.");
   }

   static _colors = {
      reset: "\x1b[0m",
      red: "\x1b[31m",
      yellow: "\x1b[33m",
      green: "\x1b[32m",
      blue: "\x1b[34m",
   };

   static error(isDebug, message) {
      let fullMessage = "";
      let isEnvDebug = process.env.DEBUG == "true";

      if (isDebug) {
         if (!isEnvDebug) {
            return;
         }
         fullMessage += `${this._colors.yellow}[debug]${this._colors.reset}`;
      }
      fullMessage += `${this._colors.red}[ERROR]${this._colors.reset} ${message}`;
      console.log(fullMessage);
   }

   static warning(isDebug, message) {
      let fullMessage = "";
      let isEnvDebug = process.env.DEBUG == "true";

      if (isDebug) {
         if (!isEnvDebug) {
            return;
         }
         fullMessage += `${this._colors.yellow}[debug]${this._colors.reset}`;
      }
      fullMessage += `${this._colors.yellow}[WARNING]${this._colors.reset} ${message}`;
      console.log(fullMessage);
   }

   static info(isDebug, message) {
      let fullMessage = "";
      let isEnvDebug = process.env.DEBUG == "true";

      if (isDebug) {
         if (!isEnvDebug) {
            return;
         }
         fullMessage += `${this._colors.yellow}[debug]${this._colors.reset}`;
      }
      fullMessage += `${this._colors.blue}[INFO]${this._colors.reset} ${message}`;
      console.log(fullMessage);
   }

   static success(isDebug, message) {
      let fullMessage = "";
      let isEnvDebug = process.env.DEBUG == "true";

      if (isDebug) {
         if (!isEnvDebug) {
            return;
         }
         fullMessage += `${this._colors.yellow}[debug]${this._colors.reset}`;
      }
      fullMessage += `${this._colors.green}[SUCCESS]${this._colors.reset} ${message}`;
      console.log(fullMessage);
   }
}
