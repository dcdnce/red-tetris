import { createSlice, createSelector } from "@reduxjs/toolkit";
import {
    kErrorState,
    kPendingState,
    kStartedState,
} from "../services/constants";

// Memoization cache for parameterized selectors
const selectorCache = {
    roomState: new Map(),
    roomError: new Map(),
    players: new Map(),
    isRoomLeader: new Map(),
};

const initialState = {
    rooms: {
        // roomName:
        // roomState:
        // winnerUsername:
        // players: [
        //     {
        //         username: null,
        //         board: null, [array]
        //         boardFull: null, [array]
        //         nextPiece: null, [array]
        //          TODO add BoardStats data
        //         isConnected: null,
        //         isOutOfPlay: null,
        //         isLeader: null,
        //         remainingEPLInputs: null,
        //     },
        // ],
        // roomState: kPendingState,
        // error: null,
    },
};

const gameSlice = createSlice({
    name: "roomsHandler",
    initialState,
    reducers: {
        joinRoomSuccess: (state, action) => {
            const roomName = action.payload.roomName;

            state.rooms[roomName] = {
                roomName: action.payload.roomName,
                players: action.payload.players,
                roomState: kPendingState,
                error: null,
            };

            // console.log(action.payload.players);
        },
        updateGameData: (state, action) => {
            const roomName = action.payload.roomName;
            state.rooms[roomName].roomState = action.payload.roomState;
            state.rooms[roomName].players = action.payload.players;
            state.rooms[roomName].winnerUsername =
                action.payload.winnerUsername;
            // console.log(action.payload.players);
        },
        joinRoomFailed: (state, action) => {
            const roomName = action.payload.roomName;
            state.rooms[roomName] = {
                roomName: null,
                players: null,
                roomState: kErrorState,
                error: action.payload.error,
            };
        },
        roomLaunchSuccess: (state, action) => {
            const roomName = action.payload.roomName;
            state.rooms[roomName].roomState = kStartedState;
            // console.log(action.payload.message);
        },
    },
});

export const {
    joinRoomSuccess,
    joinRoomFailed,
    updateGameData,
    roomLaunchSuccess,
} = gameSlice.actions;

export default gameSlice.reducer;

// Base selectors
const selectRooms = (state) => state.roomsHandler.rooms;

// Memoized parameterized selectors
export const selectRoomState = (roomName) => {
    if (!selectorCache.roomState.has(roomName)) {
        selectorCache.roomState.set(
            roomName,
            createSelector(
                [selectRooms],
                (rooms) => rooms[roomName]?.roomState || null
            )
        );
    }
    return selectorCache.roomState.get(roomName);
};

export const selectRoomError = (roomName) => {
    if (!selectorCache.roomError.has(roomName)) {
        selectorCache.roomError.set(
            roomName,
            createSelector(
                [selectRooms],
                (rooms) => rooms[roomName]?.error || null
            )
        );
    }
    return selectorCache.roomError.get(roomName);
};

export const selectPlayers = (roomName) => {
    if (!selectorCache.players.has(roomName)) {
        selectorCache.players.set(
            roomName,
            createSelector(
                [selectRooms],
                (rooms) => rooms[roomName]?.players || null
            )
        );
    }
    return selectorCache.players.get(roomName);
};

export const selectIsRoomLeader = (roomName, username) => {
    const cacheKey = `${roomName}:${username}`;
    if (!selectorCache.isRoomLeader.has(cacheKey)) {
        selectorCache.isRoomLeader.set(
            cacheKey,
            createSelector([selectRooms], (rooms) => {
                const leader = rooms[roomName]?.players?.find(
                    (player) => player.isLeader
                );
                return leader?.username === username;
            })
        );
    }
    return selectorCache.isRoomLeader.get(cacheKey);
};
export const selectWinnerUsername = (roomName) => (state) =>
    state.roomsHandler.rooms[roomName]?.winnerUsername || null;
