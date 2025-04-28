import handleRoomExit from "./tetris-events/room_exit.js";
import handleRoomJoin from "./tetris-events/room_join.js";

export default function handleTetrisRelated(socket)
{
	handleRoomJoin(socket);
	handleRoomExit(socket);
}