import GameMapSingleton from "../../services/gameMapSingleton.js";
import Logger from "../../services/logger.js";

export default function getRoomBySearch(socket) {
    const gameMapSingletonInstance = new GameMapSingleton();
    socket.on("get_room_by_search", (data, callback) => {
        const searchValue = data?.searchValue || "";
        const rooms = gameMapSingletonInstance.getRoomBySearch(searchValue);
        if (typeof callback === "function") {
            callback({
                success: true,
                rooms: rooms,
            });
        }
    });
}
