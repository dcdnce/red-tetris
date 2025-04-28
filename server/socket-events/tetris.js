import handleRoomExit from "./tetris-events/room_exit.js";
import handleRoomJoin from "./tetris-events/room_join.js";
import handleRoomJoinRequest from "./tetris-events/room_join_request.js";

export default function handleTetrisRelated(socket) {
   handleRoomJoinRequest(socket);
   handleRoomJoin(socket);
   handleRoomExit(socket);
}
