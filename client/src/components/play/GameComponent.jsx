import React, { useEffect } from "react";
import Board from "./Board";
import { rotatePiece } from "../../store/gameSlice";
import { useDispatch } from "react-redux";

function GameComponent() {
   const dispatch = useDispatch();

   const handleUserInput = (event) => {
      if (event.key == 'ArrowUp') {
         dispatch(rotatePiece())
      }
   };

   useEffect(() => {
      window.addEventListener('keydown', handleUserInput);
      return () => {
         window.removeEventListener('keydown', handleUserInput);
      };
   }, [dispatch]);

   return (
      <>
         <h2>Game compo test</h2>
         <Board/>
      </>
   );
}

export default GameComponent;