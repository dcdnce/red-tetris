import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ScoreRepository, getAndSaveScoreForPlayer } from '../../src/repositories/ScoreRepository.js';
import { AppDataSource } from '../../src/config/database.js';
import Logger from '../../src/services/logger.js';

vi.mock('../../src/config/database.js', () => ({
    AppDataSource: {
        getRepository: vi.fn(),
    },
}));

vi.mock('../../src/services/logger.js', () => ({
    default: { error: vi.fn(), success: vi.fn() },
}));

describe('ScoreRepository', () => {
    let mockRepo;

    beforeEach(() => {
        mockRepo = {
            create: vi.fn(),
            save: vi.fn(),
            find: vi.fn(),
        };
        AppDataSource.getRepository.mockReturnValue(mockRepo);
        vi.clearAllMocks();
    });

    describe('saveScore', () => {
        it('should create and save a new score successfully', async () => {
            const newScore = { username: 'testuser', score: 100, linesCleared: 10, isActive: true };
            mockRepo.create.mockReturnValue(newScore);

            const result = await ScoreRepository.saveScore('testuser', 100, 10);

            expect(mockRepo.create).toHaveBeenCalledWith(newScore);
            expect(mockRepo.save).toHaveBeenCalledWith(newScore);
            expect(Logger.success).toHaveBeenCalledWith('Score saved for testuser: 100 points');
            expect(result).toEqual(newScore);
        });

        it('should handle errors when saving score', async () => {
            const error = new Error('Database Error');
            mockRepo.save.mockRejectedValue(error);

            await expect(ScoreRepository.saveScore('testuser', 100, 10)).rejects.toThrow('Database Error');
            expect(Logger.error).toHaveBeenCalledWith('Error saving score for testuser:', error);
        });
    });

    describe('getTopScores', () => {
        it('should return top scores', async () => {
            const mockScores = [
                { username: 'player1', score: 1000 },
                { username: 'player2', score: 800 },
            ];
            mockRepo.find.mockResolvedValue(mockScores);

            const result = await ScoreRepository.getTopScores(2);

            expect(mockRepo.find).toHaveBeenCalledWith({
                where: { isActive: true },
                order: { score: "DESC" },
                take: 2,
            });
            expect(result).toEqual(mockScores);
        });

        it('should handle errors when finding top scores', async () => {
             const error = new Error('Database Error');
             mockRepo.find.mockRejectedValue(error);

             await expect(ScoreRepository.getTopScores(2)).rejects.toThrow('Database Error');
             expect(Logger.error).toHaveBeenCalledWith('Error fetching top scores:', error);
        });
    });

    describe('getScoresByUsername', () => {
         it('should return scores for a username', async () => {
             const mockScores = [{ username: 'testuser', score: 1000 }];
             mockRepo.find.mockResolvedValue(mockScores);

             const result = await ScoreRepository.getScoresByUsername('testuser');

             expect(mockRepo.find).toHaveBeenCalledWith({
                 where: { username: 'testuser', isActive: true },
                 order: { score: "DESC" },
             });
             expect(result).toEqual(mockScores);
         });

         it('should handle errors when finding scores by username', async () => {
             const error = new Error('Database Error');
             mockRepo.find.mockRejectedValue(error);

             await expect(ScoreRepository.getScoresByUsername('testuser')).rejects.toThrow('Database Error');
             expect(Logger.error).toHaveBeenCalledWith('Error fetching scores for testuser:', error);
         });
    });
});

describe('getAndSaveScoreForPlayer', () => {
    it('should save score via getAndSaveScoreForPlayer', async () => {
        const mockPlayer = {
            getBoardObject: () => ({
                boardStats: {
                    getScore: () => 500,
                    getLinesCleared: () => 5
                }
            })
        };

        const saveScoreSpy = vi.spyOn(ScoreRepository, 'saveScore').mockResolvedValue(true);

        await getAndSaveScoreForPlayer(mockPlayer, 'sacha');

        expect(saveScoreSpy).toHaveBeenCalledWith('sacha', 500, 5);
        saveScoreSpy.mockRestore();
    });

    it('should catch error when getAndSaveScoreForPlayer fails', async () => {
         const mockPlayer = {
            getBoardObject: () => ({
                boardStats: { getScore: () => 500, getLinesCleared: () => 5 }
            })
        };
        const error = new Error('Failed');
        const saveScoreSpy = vi.spyOn(ScoreRepository, 'saveScore').mockRejectedValue(error);

        await getAndSaveScoreForPlayer(mockPlayer, 'sacha');

        expect(Logger.error).toHaveBeenCalledWith('Failed to save score for sacha:', error);
        saveScoreSpy.mockRestore();
    });
});