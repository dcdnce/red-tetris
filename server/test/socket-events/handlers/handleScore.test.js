import { describe, expect, it, vi, beforeEach } from 'vitest';
import getBestScore from '../../../src/socket-events/handlers/handleScore.js';
import { ScoreRepository } from '../../../src/repositories/ScoreRepository.js';

vi.mock('../../../src/repositories/ScoreRepository.js', () => ({
    ScoreRepository: {
        getTopScores: vi.fn()
    }
}));

describe('handleScore', () => {
    let mockSocket;
    let registeredCallback;

    beforeEach(() => {
        mockSocket = {
            on: vi.fn((event, callback) => {
                if (event === 'get_best_score') {
                    registeredCallback = callback;
                }
            })
        };
        getBestScore(mockSocket);
    });

    it('registers get_best_score event', () => {
        expect(mockSocket.on).toHaveBeenCalledWith('get_best_score', expect.any(Function));
    });

    it('returns best scores on success', async () => {
        const mockScores = [{ username: 'sacha', score: 1000 }];
        ScoreRepository.getTopScores.mockResolvedValue(mockScores);

        const callback = vi.fn();
        await registeredCallback({}, callback);

        expect(ScoreRepository.getTopScores).toHaveBeenCalledWith(10);
        expect(callback).toHaveBeenCalledWith({ success: true, scores: mockScores });
    });

    it('returns error message on failure', async () => {
        ScoreRepository.getTopScores.mockRejectedValue(new Error('DB Error'));

        const callback = vi.fn();
        await registeredCallback({}, callback);

        expect(callback).toHaveBeenCalledWith({ success: false, error: 'DB Error' });
    });
});