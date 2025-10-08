import GameMapSingleton from "../../objects/gameMapSingleton.js";
import Logger from "../../utils/logger.js";

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
