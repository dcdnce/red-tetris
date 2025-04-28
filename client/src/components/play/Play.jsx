import React, { useState, useEffect } from "react";
import Board from "./Board";
import { rotatePiece } from "../../store/gameSlice";
import { useDispatch } from "react-redux";
import { socket } from "../../socket"

function Play() {
   const dispatch = useDispatch();

   const handleUserInput = (event) => {
      if (event.key == 'ArrowUp') {
         dispatch(rotatePiece())
      }
   };

   // Inputs
   useEffect(() => {
      window.addEventListener('keydown', handleUserInput);
      return () => {
         window.removeEventListener('keydown', handleUserInput);
      };
   }, [dispatch]);

   // Specific room connexion
   useEffect(() => {
      socket.emit('room_join', 'play'); // -> 'play' is room name

      return () => {
         socket.emit('room_exit');
      }
   }, []);

   return (
      <>
         <h2>Game compo test</h2>
         <Board/>
      </>
   );
}

export default Play;