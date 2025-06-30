export default class Logger {
	constructor() {
		throw new Error("Logger cannot be instanciate.")
	}

	static _colors = {
		reset: "\x1b[0m",
		red: "\x1b[31m",
		yellow: "\x1b[33m",
		green: "\x1b[32m",
		blue: "\x1b[34m"
	};


	static error(message) {
		console.error(`${this._colors.red}[ERROR]${this._colors.reset} ${message}`);
	}

	static warning(message) {
		console.warn(`${this._colors.yellow}[WARNING]${this._colors.reset} ${message}`);
	}

	static info(message) {
		console.info(`${this._colors.blue}[INFO]${this._colors.reset} ${message}`);
	}

	static success(message) {
		console.log(`${this._colors.green}[SUCCESS]${this._colors.reset} ${message}`);
	}

	static debug(message) {
		if (process.env.DEBUG == "true") {
			console.log(`[DEBUG] ${message}`);
		}
	}
}
