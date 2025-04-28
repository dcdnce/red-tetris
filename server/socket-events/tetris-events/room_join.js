export default function handleRoomJoin(socket)
{
	socket.on('room_join', (roomName) => {
		if (typeof roomName !== 'string' || roomName !== 'play') {
			console.warn(`Invalid room name received from ${socket.id}:`, roomName);
		}

		socket.join(roomName);
		console.log(`Client ${socket.id} joined room: ${roomName}`);
	})
}