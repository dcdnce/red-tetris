import GameMapSingleton from "../../services/gameMapSingleton.js";
import Logger from "../../services/logger.js";
import { kStartedState } from "../../objects/roomstate.js";
import emitUpdateGameData from "../emitters/emit_update_game_data.js";

export default function handleRoomExit(socket) {
    const cleanupPlayer = (player) => {
        if (!player) return;

        const roomName = player.currentGame.roomName;
        const game = player.currentGame;

        if (game.getState() != kStartedState) {
            definitiveDisconnection(player);

            // Last player ?
            if (!game.players.size) {
                endAndDeleteRoom(game);
                return;
            }
        }

        if (game.getState() == kStartedState) {
            temporaryDisconnection(player);
        }

        // emitUpdatePlayerList(game);
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

export function endAndDeleteRoom(game) {
    game.endGame();
    if (GameMapSingleton.delete(game.roomName) == false) {
        throw new Error(`Couldn't delete game room ${game.roomName}`);
    }
    Logger.info(false, null, `Deleting game room ${game.roomName}`);
}

/**
 *
 * Either called by :
 *  - gameloop after x seconds disconnected
 *  - handleRoomExit if player quits a lobby being in waiting state
 * @param {Player} player
 */
export function definitiveDisconnection(player) {
    let game = player.currentGame;

    player.socket.leave(game.roomName);
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
