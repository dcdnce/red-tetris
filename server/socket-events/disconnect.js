export default function handleDisconnect(socket) {
	socket.on("disconnect", (reason) => {
	   console.log(`Client disconnected: ${socket.id}. Reason: ${reason}`);
	});
 }
 