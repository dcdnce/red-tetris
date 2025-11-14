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
}
