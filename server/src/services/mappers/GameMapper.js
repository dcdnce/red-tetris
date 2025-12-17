import { kTetriminosTypes } from "../../constants/tetriminos_constants.js";
import { BoardMapper } from "./BoardMapper.js";

export class GameMapper {
    static #getNextPiece(id) {
        if (id === null || id === undefined) return null;

        let nextPiece = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];

        const tetrimino = kTetriminosTypes[id].rotationStates[0];

        for (const block of tetrimino) {
            const y = block[0] + (id != 2); // offset needed if piece isn't I
            const x = block[1] + (id != 2);

            nextPiece[y][x] = id;
        }

        return nextPiece;
    }

    static getPlayerList(gameObject) {
        const playerList = [];
        for (const [username, player] of gameObject.players) {
            playerList.push({
                username: username,
                board: player.getBoardObject().getBoard(),
                boardFull: BoardMapper.getFullBoard(player.getBoardObject()),
                nextPiece: GameMapper.#getNextPiece(player.getNextPieceId()),
                // tetrimino: BoardMapper.getTetriminoCoords(),
                // ghost: BoardMapper.getGhostCoords(),
                // tetriminoType: player
                //     .getBoardObject()
                //     .getTetrimino()
                //     ?.getType(), // TODO delete it's a debug
                isConnected: player.isConnected,
                didLost: player.didLost,
                isLeader: player.token === gameObject.leaderToken,
                remainingEPLInputs: player
                    .getBoardObject()
                    .getRemainingEPLInputs(),
            });
        }
        return playerList;
    }
}
