import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const BACKEND_PORT = 3001;

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()], // Active le support React (JSX, Fast Refresh)

    // Configuration du serveur de développement Vite
    server: {
        port: 5173, // Port pour le client (différent du backend)
        strictPort: true,
        proxy: {
            // Proxy pour les requêtes API (si vous en faites en HTTP)
            "/api": {
                target: `http://localhost:${BACKEND_PORT}`,
                changeOrigin: true,
                secure: false,
            },
            // Proxy pour Socket.IO (essentiel !)
            "/socket.io": {
                target: `http://localhost:${BACKEND_PORT}`,
                secure: false,
                ws: true, // Activer le proxy WebSocket
                changeOrigin: true,
            },
        },
    },

    // Configuration du build pour la production
    build: {
        // Où générer les fichiers buildés (relatif à la racine du projet,
        // car la commande 'vite build' sera lancée depuis la racine)
        outDir: "dist/client",
        emptyOutDir: true, // Nettoie le dossier avant de builder
        // sourcemap: true, // Optionnel: générer les sourcemaps pour le débogage prod
    },
});
