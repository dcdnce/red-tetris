import Logger from "../utils/logger.js";

export default function handleDisconnect(socket) {
    socket.on("disconnect", (reason) => {
        Logger.info(
            true,
            `Client disconnected: ${socket.id}. Reason: ${reason}`
        );
    });
}
