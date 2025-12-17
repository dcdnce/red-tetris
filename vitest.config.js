import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        // 1. Activer les globales pour une API compatible Jest (describe, it, expect)
        globals: true,

        setupFiles: "./vitest.setup.js",

        // 2. Définir l'environnement par défaut (node pour le backend, jsdom pour le frontend)
        // On peut surcharger ça par fichier si besoin.
        environment: "node",

        // 3. Configuration de la couverture de code
        coverage: {
            enabled: "true",
            provider: "v8", // Utiliser le provider v8
            reporter: ["text", "json", "html"], // Formats de rapport
            reportsDirectory: "./coverage", // Dossier de sortie
            // Fichiers à inclure dans le rapport
            include: ["server/src/**/*.js"],
            // Objectifs de couverture (du sujet)
            thresholds: {
                statements: 70,
                branches: 50,
                functions: 70,
                lines: 70,
            },
        },

        // 4. Fichier de setup (si vous en avez un)
        // setupFiles: './jest.setup.js', // Vous pouvez réutiliser votre fichier de setup
    },
});
