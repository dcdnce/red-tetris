import GameMapSingleton from "../services/gameMapSingleton.js";
import handleRoomExit from "./handlers/handleRoomExit.js";
import handleRoomJoin from "./handlers/handleRoomJoinRequest.js";
import handleRoomLaunch from "./handlers/handleRoomLaunch.js";
import handleUserInput from "./handlers/handleUserInput.js";

export default function handleTetris(socket) {
    handleRoomJoin(socket);
    handleRoomExit(socket);
    handleRoomLaunch(socket);
    handleUserInput(socket);
    getBoard(socket);
}

export function getBoard(socket) {
    socket.on("get_board", (params, callback) => {
        const { username, roomName } = params;

        if (!GameMapSingleton.has(roomName)) {
            return callback({
                success: false,
                error: `No game found for room "${roomName}"`,
            });
        }

        const gameInstance = GameMapSingleton.get(roomName);
        return callback({
            success: true,
            content: gameInstance.board,
        });
    });
}
