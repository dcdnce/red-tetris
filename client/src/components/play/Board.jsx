import React from "react";
import styles from "../../styles/play/Board.module.css";
import { useSelector } from "react-redux";
import { calculateAbsoluteBlockPositions } from "../../store/gameSliceTetriminos";

function Block({ row, col, isPlayerConnected }) {
   // Add color later
   const style = {
      gridRowStart: row + 1,
      gridColumnStart: col + 1,
   };

   return (
      <div
         className={`${isPlayerConnected ? styles.block : styles.blockOffline}`}
         style={style}
      />
   );
}

function Board({ number }) {
   const gameBoard = useSelector((state) => state.game.players[number].board);

   const isPlayerConnected = useSelector(
      (state) => state.game.players[number].isConnected
   );

   const fallingTetrimino = useSelector(
      (state) => state.game.fallingTetrimino
   );

   // Base board
   var allBlocks = Array(0);
   for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 10; j++) {
         if (gameBoard[i][j] == 1) allBlocks.push({ row: i, col: j });
      }
   }

   // Falling tetrimino
   const blocksAbsolutePosition =
      calculateAbsoluteBlockPositions(fallingTetrimino);
   for (let blockOffset of blocksAbsolutePosition) {
      allBlocks.push({ col: blockOffset[0], row: blockOffset[1] });
   }

   return (
      <div className={styles.boardContainer}>
         {allBlocks.map((block) => (
            <Block
               key={`${block.row}-${block.col}`}
               row={block.row}
               col={block.col}
               isPlayerConnected={isPlayerConnected}
            />
         ))}
      </div>
   );
}

export default Board;
