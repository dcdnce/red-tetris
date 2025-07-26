import GameMapSingleton from "../../objects/gameMapSingleton.js";
import Logger from "../../utils/logger.js";


export default function getAllRoom(socket, game) {
    const gameMap = new GameMapSingleton();
    socket.on("get_all_room", (callback) => {
        if (typeof callback === "function"){
            callback({
                success: true,
                rooms: gameMap.getAllRoom()
            });
        }
    });
}