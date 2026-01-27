import { AppDataSource } from "../config/database.js";
import { Score } from "../entities/score.entities.js";
import Logger from "../services/logger.js";

export async function getAndSaveScoreForPlayer(player, username) {
    const score = player.getBoardObject().boardStats.getScore();
    const linesCleared = player
        .getBoardObject()
        .boardStats.getLinesCleared();

    try {
        await ScoreRepository.saveScore(username, score, linesCleared);
    } catch (error) {
        Logger.error(`Failed to save score for ${username}:`, error);
    }
}

export class ScoreRepository {
    static async saveScore(username, score, linesCleared) {
        try {
            const scoreRepository = AppDataSource.getRepository(Score);

            const newScore = scoreRepository.create({
                username,
                score,
                linesCleared,
                isActive: true,
            });

            await scoreRepository.save(newScore);
            Logger.success(`Score saved for ${username}: ${score} points`);

            return newScore;
        } catch (error) {
            Logger.error(`Error saving score for ${username}:`, error);
            throw error;
        }
    }

    static async getTopScores(limit = 10) {
        try {
            const scoreRepository = AppDataSource.getRepository(Score);

            return await scoreRepository.find({
                where: { isActive: true },
                order: { score: "DESC" },
                take: limit,
            });
        } catch (error) {
            Logger.error("Error fetching top scores:", error);
            throw error;
        }
    }

    static async getScoresByUsername(username) {
        try {
            const scoreRepository = AppDataSource.getRepository(Score);

            return await scoreRepository.find({
                where: { username, isActive: true },
                order: { score: "DESC" },
            });
        } catch (error) {
            Logger.error(`Error fetching scores for ${username}:`, error);
            throw error;
        }
    }
}
