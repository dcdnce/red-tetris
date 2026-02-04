import { createSlice, isPending } from "@reduxjs/toolkit";
import {
    kErrorState,
    kPendingState,
    kStartedState,
} from "../services/constants";

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
            console.log(action.payload.players);
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

// Selectors
//    - Ready to use lambda function to access Redux store
export const selectRoomState = (roomName) => (state) =>
    state.roomsHandler.rooms[roomName]?.roomState || null;
export const selectRoomError = (roomName) => (state) =>
    state.roomsHandler.rooms[roomName]?.error || null;
export const selectPlayers = (roomName) => (state) =>
    state.roomsHandler.rooms[roomName]?.players || null;
export const selectIsRoomLeader = (roomName, username) => (state) => {
    const leader = state.roomsHandler.rooms[roomName]?.players.find(
        (player) => player.isLeader
    );
    return leader?.username === username;
};
export const selectWinnerUsername = (roomName) => (state) =>
    state.roomsHandler.rooms[roomName]?.winnerUsername || null;
