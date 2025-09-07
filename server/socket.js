import { Server as SocketIOServer } from "socket.io";
import handleDisconnect from "./socket-events/disconnect.js";
import handleTetrisRelated from "./socket-events/tetris.js";
import getAllRoom from "./socket-events/tetris-events/emit_all_room.js";

export function initializeSocketIO(server) {
    const io = new SocketIOServer(server, {
        // Options Socket.IO si nécessaire (ex: CORS pour dev sans proxy)
        cors: {
            origin: "*", // To change
            // origin: ["http://localhost:5173"], // Autorise seulement Vite en dev
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log(`Client connected: ${socket.id}`);

        handleDisconnect(socket);
        handleTetrisRelated(socket);
        getAllRoom(socket);
    });

    return io;
}
