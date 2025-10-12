import GameMapSingleton from "../../services/gameMapSingleton.js";

export default function getRoomBySearch(socket) {
    socket.on("get_room_by_search", (data, callback) => {
        const searchValue = data?.searchValue || "";
        const rooms = GameMapSingleton.getRoomBySearch(searchValue);
        if (typeof callback === "function") {
            callback({
                success: true,
                rooms: rooms,
            });
        }
    });
}
