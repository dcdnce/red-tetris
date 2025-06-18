import { createSlice } from "@reduxjs/toolkit";
import {
   createTestTetrimino,
   calculateAbsoluteBlockPositions,
   isValidPosition,
} from "./gameSliceTetriminos.js";

// const createEmptyBoard = () => Array(20).fill(null).map(() => Array(10).fill(1));

const createEmptyBoard = () => {
   return [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
   ];
};

const initialState = {
   board: createEmptyBoard(),
   fallingTetrimino: createTestTetrimino(),
   // etc
};

export const gameSlice = createSlice({
   name: "game",
   initialState,
   reducers: {
      // (state + action = newState)
      rotatePiece: (state) => {
         const { fallingTetrimino, board } = state;

         if (!fallingTetrimino) {
            return;
         }

         const nextOrientation = (fallingTetrimino.orientation + 1) % 4;

         const nextTetrimino = {
            ...fallingTetrimino,
            orientation: nextOrientation,
         };

         const nextBlockPositions =
            calculateAbsoluteBlockPositions(nextTetrimino);
         const canRotate = isValidPosition(nextBlockPositions, board);

         // WALL KICK ??

         if (canRotate) {
            state.fallingTetrimino.orientation = nextOrientation;
            console.log("can rotate!");
         }
      },

      // startGame
      // movePieceLeft
      // eraseLine
      // etc
   },
});

// EXPORT ACTIONS
// A utiliser dans vos composants React (via useDispatch).
export const {
   rotatePiece,
   // startGame,
   // movePieceLeft
} = gameSlice.actions;

export default gameSlice.reducer;

// EXPORT SELECTORS
// Les selectors permettent d'extraire des parties spécifiques de l'état
// dans les composants React sans qu'ils aient à connaître la structure exacte du state.
export const selectGame = (state) => state.game;
export const selectBoard = (state) => state.game.board;
export const selectFallingTetrimino = (state) => state.game.fallingTetrimino;
