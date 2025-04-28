export default function handleRoomExit(socket)
{
	socket.on('room_exit', () => {
		const joinedRoom = Array.from(socket.rooms).filter(room => room !== socket.id);
		socket.leave(joinedRoom);
		console.log(`Client ${socket.id} exited room: ${joinedRoom}`);
	})
}