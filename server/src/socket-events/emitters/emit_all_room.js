import GameMapSingleton from "../../services/gameMapSingleton.js";
import Logger from "../../services/logger.js";

export default function getAllRoom(socket, game) {
    const gameMapSingletonInstance = new GameMapSingleton();
    socket.on("get_all_room", (callback) => {
        if (typeof callback === "function") {
            callback({
                success: true,
                rooms: gameMapSingletonInstance.getAllRoom(),
            });
        }
    });
}
