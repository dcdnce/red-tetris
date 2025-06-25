import { createSlice, isPending } from "@reduxjs/toolkit";
import {
   createTestTetrimino,
   calculateAbsoluteBlockPositions,
   isValidPosition,
} from "./gameSliceTetriminos.js";
import { act } from "react";

const initialState = {
   board: null,
   roomName: null,
   username: null,
   playersInRoom: [],
   roomStatus: 'pending',
   error: null,
}

const gameSlice = createSlice({
   name: 'game',
   initialState,
   reducers: {
      setBoard: (state, action) => {
         state.board = action.payload;
      },
      joinRoomSuccess: (state, action) => {
         state.username = action.payload.username;
         state.roomName = action.payload.roomName;
         state.playersInRoom = action.payload.playersInRoom;
         console.log(`Players in room: ${state.playersInRoom}`);
         state.roomStatus = 'loaded';
         // state.board = action.payload.initialGameState.board;
      },
      updatePlayerList: (state, action) => {
         // recu quand un autre joueur rejoint ou quitte
         state.playersInRoom = action.payload.playersInRoom;
         console.log(`Players in room: ${state.playersInRoom}`);
      },
      joinRoomFailed: (state, action) => {
         state.roomStatus = 'error';
         state.error = action.payload.error;
      },
   },
});

export const { 
   setBoard,
   joinRoomSuccess,
   joinRoomFailed,
   updatePlayerList,
} = gameSlice.actions;

export default gameSlice.reducer;

// Selectors
export const selectRoomStatus = (state) => state.game.roomStatus;
export const selectRoomError = (state) => state.game.error;
export const selectPlayerGameBoard = (state) => state.game.board;