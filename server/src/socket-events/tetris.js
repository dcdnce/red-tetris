import { socket } from "../../../client/src/socket.js";
import GameMapSingleton from "../objects/gameMapSingleton.js";
import handleRoomExit from "./tetris-events/room_exit.js";
import handleRoomJoin from "./tetris-events/handleRoomJoinRequest.js";
import handleRoomLaunch from "./tetris-events/room_launch.js";

export default function handleTetrisRelated(socket) {
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
