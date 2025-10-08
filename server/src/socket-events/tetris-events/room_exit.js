import GameMapSingleton from "../../objects/gameMapSingleton.js";
import Logger from "../../utils/logger.js";
import emitUpdatePlayerList from "./emit_update_player_list.js";
import { kStartedState } from "../../objects/roomstate.js";
import emitUpdateGameData from "./emit_update_game_data.js";

export default function handleRoomExit(socket) {
    const cleanupPlayer = (player) => {
        if (!player) return;

        const roomName = player.currentGame.roomName;
        const game = player.currentGame;

        if (game.getState() != kStartedState) {
            definitiveDisconnection(game, player);

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
            const gameMapSingletonInstance = new GameMapSingleton();
            const roomCount = gameMapSingletonInstance.container.size;

            // Supprimer toutes les rooms
            gameMapSingletonInstance.container.clear();

            Logger.info(true, null, `All ${roomCount} rooms have been deleted`);

            // Optionnel : Déconnecter tous les sockets de toutes les rooms
            socket.broadcast.emit("all_rooms_cleared");
        } catch (error) {
            Logger.error(true, `Error clearing all rooms: ${error.message}`);
        }
    });
}

export function endAndDeleteRoom(game) {
    const gameMapSingletonInstance = new GameMapSingleton();
    game.endGame();
    gameMapSingletonInstance.delete(game.roomName);
    Logger.info(false, null, `Deleting game room ${game.roomName}`);
}

// Either called by :
//    - gameloop after x seconds disconnected
//    - handleRoomExit if player quits a lobby being in waiting state
export function definitiveDisconnection(game, player) {
    const roomName = player.currentGame.roomName;
    player.socket.leave(roomName);
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
