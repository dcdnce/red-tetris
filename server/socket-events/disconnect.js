import Logger from "../utils/logger.js";

export default function handleDisconnect(socket) {
    socket.on("disconnect", (reason) => {
        Logger.info(
            true,
            null,
            `Client disconnected: ${socket.id}. Reason: ${reason}`
        );
    });
}
