import GameMapSingleton from "../../services/gameMapSingleton.js";
import Logger from "../../services/logger.js";
import { kStartedState } from "../../objects/roomstate.js";
import emitUpdateGameData from "../emitters/emit_update_game_data.js";
import { getAndSaveScoreForPlayer } from "../../repositories/ScoreRepository.js";

export default function handleRoomExit(socket) {
    const cleanupPlayer = (player) => {
        if (!player) return;

        const roomName = player.currentGame.roomName;
        const game = player.currentGame;

        if (game.getState() != kStartedState) {
            definitiveDisconnection(player);

            // Last player ?
            if (!game.players.size) {
                game.endAndDelete();
                return;
            }
        }

        if (game.getState() == kStartedState) {
            temporaryDisconnection(player);
        }

        emitUpdateGameData(game);

        Logger.info(
            true,
            null,
            `Client ${player.username} exited room: ${roomName}`
        );
    };

    socket.on("room_exit", () => {
        // If socket has no username => nothing to clean
        cleanupPlayer(socket.player);
    });

    socket.on("disconnecting", () => {
        // If socket has no username => nothing to clean
        cleanupPlayer(socket.player);
    });

    socket.on("exit_all", () => {
        try {
            const roomCount = GameMapSingleton.container.size;

            // Supprimer toutes les rooms
            GameMapSingleton.container.clear();

            Logger.info(true, null, `All ${roomCount} rooms have been deleted`);

            // Optionnel : Déconnecter tous les sockets de toutes les rooms
            socket.broadcast.emit("all_rooms_cleared");
        } catch (error) {
            Logger.error(true, `Error clearing all rooms: ${error.message}`);
        }
    });
}

/**
 *
 * Either called by :
 *  - gameloop after x seconds disconnected
 *  - handleRoomExit() if player quits a lobby being in waiting state
 *  - game.endAndDelete()
 * @param {Player} player
 */
export function definitiveDisconnection(player) {
    let game = player.currentGame;

    player.socket.leave(game.roomName);
    player.socket.player = null;
    getAndSaveScoreForPlayer(player, player.username);
    game.players.delete(player.username);

    // Change room leader
    if (game.leaderToken === player.token && game.players.size) {
        let newLeader = game.players.values().next().value;
        game.leaderToken = newLeader.token;
        Logger.info(true, null, `New room leader is : ${newLeader.username}`);
    }
}

function temporaryDisconnection(player) {
    player.socket.leave(player.currentGame.roomName); // Leave socket.io room
    player.socket.player = null;
    player.setDisconnected();
}
