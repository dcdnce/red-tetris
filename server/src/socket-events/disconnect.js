import Logger from "../services/logger.js";

export default function handleDisconnect(socket) {
    socket.on("disconnect", (reason) => {
        Logger.info(
            false,
            null,
            `Client disconnected: ${socket.id}. Reason: ${reason}`
        );
    });
}
