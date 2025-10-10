import GameMapSingleton from "../services/gameMapSingleton.js";
import handleRoomExit from "./handlers/handleRoomExit.js";
import handleRoomJoin from "./handlers/handleRoomJoinRequest.js";
import handleRoomLaunch from "./handlers/handleRoomLaunch.js";

export default function handleTetris(socket) {
    handleRoomJoin(socket);
    handleRoomExit(socket);
    handleRoomLaunch(socket);
    getBoard(socket);
}

export function getBoard(socket) {
    socket.on("get_board", (params, callback) => {
        const { username, roomName } = params;
        const gameMapSingletonInstance = new GameMapSingleton();

        if (!gameMapSingletonInstance.has(roomName)) {
            return callback({
                success: false,
                error: `No game found for room "${roomName}"`,
            });
        }

        const gameInstance = gameMapSingletonInstance.get(roomName);
        return callback({
            success: true,
            content: gameInstance.board,
        });
    });
}
