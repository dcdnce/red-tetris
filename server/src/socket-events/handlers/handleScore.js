import { ScoreRepository } from "../../repositories/ScoreRepository.js";

export default function getBestScore(socket) {
    socket.on("get_best_score", async (data, callback) => {
        try {
            const bestScores = await ScoreRepository.getTopScores(10);
            callback({ success: true, scores: bestScores });
        } catch (error) {
            callback({ success: false, error: error.message });
        }
    });
}
