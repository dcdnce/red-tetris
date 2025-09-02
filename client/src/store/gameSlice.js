import { createSlice, isPending } from "@reduxjs/toolkit";

const initialState = {
   roomName: null,
   username: null,
   players: [
      {
         username: null,
         board: null,
         isConnected: null,
      },
   ],
   roomStatus: "pending",
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
         state.roomStatus = "loaded";
      },
      updatePlayerList: (state, action) => {
         // recu quand un autre joueur rejoint ou quitte
         state.players = action.payload.players;
         console.log(`Players in room: ${state.players}`);
      },
      joinRoomFailed: (state, action) => {
         state.roomStatus = "error";
         state.error = action.payload.error;
      },
   },
});

export const { setBoard, joinRoomSuccess, joinRoomFailed, updatePlayerList } =
   gameSlice.actions;

export default gameSlice.reducer;

// Selectors
//    - Ready to use lambda function to access Redux store
export const selectRoomStatus = (state) => state.game.roomStatus;
export const selectRoomError = (state) => state.game.error;
export const selectplayers = (state) => state.game.players || [];
