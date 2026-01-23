import { Server as SocketIOServer } from "socket.io";
import handleDisconnect from "./disconnect.js";
import handleTetris from "./handleTetris.js";
import handleScore from "./handlers/handleScore.js";
import getAllRoom from "./emitters/emit_all_room.js";
import getRoomBySearch from "./emitters/emit_get_room_by_search.js";
import Logger from "../services/logger.js";
import { SocketManager } from "../services/socketManager.js";

export function initializeSocketIO(server) {
    const io = new SocketIOServer(server, {
        // Options Socket.IO si nécessaire (ex: CORS pour dev sans proxy)
        cors: {
            origin: "*", // To change
            // origin: ["http://localhost:5173"], // Autorise seulement Vite en dev
            methods: ["GET", "POST"],
        },
    });

    SocketManager.init(io);

    io.on("connection", (socket) => {
        Logger.info(false, null, `Client connected: ${socket.id}`);

        handleDisconnect(socket);
        handleTetris(socket);
        getAllRoom(socket);
        getRoomBySearch(socket);
        handleScore(socket);
    });

    return io;
}
