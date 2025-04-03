import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

/* --- Configuration initiale --- */
const PORT = process.env.SERVER_PORT || 3001; // Récupère le port depuis les variables d'environnement ou utilise 3001 par défaut

// Calcule les chemins __dirname et __filename pour les modules ES
// __filename correspond au chemin complet du fichier courant (server/index.js)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

/* --- Initialisation du serveur --- */
const appExpress = express();
const httpServer = createServer(appExpress);
const io = new SocketIOServer(httpServer, {
    // Options Socket.IO si nécessaire (ex: CORS pour dev sans proxy)
    cors: {
        origin: "*", // A affiner en production !
        // origin: ["http://localhost:5173"], // Autorise seulement Vite en dev
        methods: ["GET", "POST"],
    },
});

/* --- Middlewares Express --- */
// Sert les fichiers statiques generes par le build de Vite
const clientBuildPath = path.join(ROOT_DIR, "dist", "client");
appExpress.use(express.static(clientBuildPath));
console.log(`Serving static files from: ${clientBuildPath}`);

/* --- Socket.IO --- */
io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Repondre au ping
    socket.on("ping", (callback) => {
        console.log(`Received ping from ${socket.id}`);
        if (typeof callback === "function") {
            callback("pong");
        }
    });

    // Deconnexion
    socket.on("disconnect", (reason) => {
        console.log(`Client disconnected: ${socket.id}. Reason: ${reason}`);
    });
});

/* --- Route Catch All --- */
appExpress.get(/^\/(?!api|socket.io).*/, (req, res) => {
    // Regex pour capturer tout sauf /api et /socket.io
    const indexPath = path.join(clientBuildPath, "index.html");
    console.log(`Serving index.html for route: ${req.path} from ${indexPath}`); // Debug
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error("Error sending index.html:", err);
            res.status(500).send(err);
        }
    });
});

/* --- Demarrage serveur --- */
httpServer.listen(PORT, () => {
    console.log(`--- Server listening on http://localhost:${PORT} ---`);
    console.log(
        `--- Client dev server should run on http://localhost:5173 ---`
    );
    console.log(`--- Access the app in dev at http://localhost:5173 ---`);
    console.log(
        `--- Access the app in production (after build) at http://localhost:${PORT} ---`
    );
});
