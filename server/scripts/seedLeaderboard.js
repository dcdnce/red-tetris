#!/usr/bin/env node
import { initializeDatabase } from "../src/config/database.js";
import { ScoreRepository } from "../src/repositories/ScoreRepository.js";

async function seed() {
    try {
        await initializeDatabase();

        const sampleUsers = [
            "alice",
            "bob",
            "carol",
            "dave",
            "eve",
            "mallory",
            "trent",
            "peggy",
            "oscar",
            "victor",
        ];

        const promises = [];

        for (const user of sampleUsers) {
            const score = Math.floor(Math.random() * 20000) + 100; // random score
            const linesCleared = Math.floor(Math.random() * 500);

            promises.push(ScoreRepository.saveScore(user, score, linesCleared));
        }

        const results = await Promise.all(promises);
        console.log(`Seeded ${results.length} leaderboard entries.`);
        process.exit(0);
    } catch (err) {
        console.error("Error seeding leaderboard:", err);
        process.exit(1);
    }
}

seed();
