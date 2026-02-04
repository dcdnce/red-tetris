import { PIECE_SEQUENCE_LENGTH } from "./Game";

export class GameRules {
    static generatePiecesSequence() {
        const baseBag = [1, 2, 3, 4, 5, 6, 7];
        let piecesSequence = [];

        while (piecesSequence.length < PIECE_SEQUENCE_LENGTH) {
            let shuffledBag = [...baseBag];

            // Shuffle
            for (let i = shuffledBag.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [shuffledBag[i], shuffledBag[j]] = [
                    shuffledBag[j],
                    shuffledBag[i],
                ];
            }

            piecesSequence.push(...shuffledBag);
        }

        return piecesSequence;
    }
}
