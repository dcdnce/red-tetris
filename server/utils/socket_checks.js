export function roomJoinRoomNameCheck(roomName, socket)
{
	if (typeof roomName !== 'string' || !roomName.trim().length || roomName.trim().length > 5) {
		console.warn(`Invalid room name received from ${socket.id}:`, roomName);
		return false;
	}
	
	return true;
}