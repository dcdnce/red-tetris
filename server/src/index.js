import "dotenv/config";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { initializeSocketIO } from "./socket-events/initialize_socketio.js";
import Logger from "./services/logger.js";

/* --- Configuration initiale --- */
const PORT = process.env.SERVER_PORT || 3001; // Récupère le port depuis les variables d'environnement ou utilise 3001 par défaut

Logger.warning(false, null, `Create .env if not already done.`);
Logger.info(false, null, `Server is in debug mode : ${process.env.DEBUG}`);

// Calcule les chemins __dirname et __filename pour les modules ES
// __filename correspond au chemin complet du fichier courant (server/index.js)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

/* --- Initialisation du serveur --- */
const appExpress = express();
const httpServer = createServer(appExpress);

/* --- Middlewares Express --- */
// Sert les fichiers statiques generes par le build de Vite
const clientBuildPath = path.join(ROOT_DIR, "dist", "client");
appExpress.use(express.static(clientBuildPath));
Logger.info(true, null, `Serving static files from: ${clientBuildPath}`);

/* --- Route Catch All --- */
appExpress.get(/^\/(?!api|socket.io).*/, (req, res) => {
    // Regex pour capturer tout sauf /api et /socket.io
    const indexPath = path.join(clientBuildPath, "index.html");
    Logger.info(
        true,
        null,
        `Serving index.html for route: ${req.path} from ${indexPath}`
    );
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error("Error sending index.html:", err);
            res.status(500).send(err);
        }
    });
});

/* --- Socket.IO --- */
initializeSocketIO(httpServer);

/* --- Demarrage serveur --- */
httpServer.listen(PORT, () => {
    Logger.info(
        false,
        null,
        `--- Server listening on http://localhost:${PORT} ---`
    );
    Logger.info(
        false,
        null,
        `--- Access the app in dev at http://localhost:5173 ---`
    );
    Logger.info(
        false,
        null,
        `--- Access the app in production (after build) at http://localhost:${PORT} ---`
    );
});
/*
Ce message d'erreur indique que le client essaie de se connecter à Socket.IO sur le port 3001, mais que le serveur n'est pas encore démarré ou accessible à cette adresse/port.
Vérifie que :
1. Tu as bien lancé le serveur Node.js (`npm run dev` ou `node server/index.js`) et qu'il écoute sur le port 3001.
2. Le client (Vite) tente de se connecter à la bonne URL/port pour Socket.IO. Si tu utilises un proxy dans vite.config.js, assure-toi qu'il redirige bien les requêtes /socket.io vers localhost:3001.
3. Aucun pare-feu ou processus n'empêche la connexion sur ce port.
En résumé : démarre d'abord le serveur backend avant le client, et vérifie la configuration du proxy côté Vite.
*/
