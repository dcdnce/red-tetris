import { createSlice, isPending } from "@reduxjs/toolkit";
import {
    kErrorState,
    kLoadingState,
    kPendingState,
    kStartedState,
} from "../services/constants";

const initialState = {
    roomName: null,
    username: null,
    players: [
        {
            username: null,
            board: null,
            isConnected: null,
            isLeader: null,
        },
    ],
    roomState: kLoadingState,
    error: null,
};

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        setBoard: (state, action) => {
            state.board = action.payload;
        },
        joinRoomSuccess: (state, action) => {
            state.username = action.payload.username;
            state.roomName = action.payload.roomName;
            state.players = action.payload.players;
            state.roomState = kPendingState;
        },
        updatePlayerList: (state, action) => {
            // recu quand un autre joueur rejoint ou quitte
            state.players = action.payload.players;
            console.log(`Players in room: ${state.players}`);
        },
        joinRoomFailed: (state, action) => {
            state.roomState = kErrorState;
            state.error = action.payload.error;
        },
        roomLaunchSuccess: (state, action) => {
            state.roomState = kStartedState;
            console.log(action.payload.message);
        },
    },
});

export const {
    setBoard,
    joinRoomSuccess,
    joinRoomFailed,
    updatePlayerList,
    roomLaunchSuccess,
} = gameSlice.actions;

export default gameSlice.reducer;

// Selectors
//    - Ready to use lambda function to access Redux store
export const selectRoomState = (state) => state.game.roomState;
export const selectRoomError = (state) => state.game.error;
export const selectPlayers = (state) => state.game.players || [];
export const selectIsRoomLeader = (username) => (state) => {
    const leader = state.game.players.find((player) => player.isLeader);
    return leader?.username === username;
};
