import { BoardMapper } from "./BoardMapper.js";

export class GameMapper {
    static getPlayerList(gameObject) {
        const playerList = [];
        for (const [username, player] of gameObject.players) {
            playerList.push({
                username: username,
                board: player.getBoardObject().getBoard(),
                boardFull: BoardMapper.getFullBoard(player.getBoardObject()),
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
