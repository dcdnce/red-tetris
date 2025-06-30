import React, { useState, useEffect, useRef } from "react";
import Board from "./Board";
// import { rotatePiece } from "../../store/gameSlice";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../socket";
import { useParams } from "react-router-dom";
import { selectRoomStatus, selectRoomError, joinRoomSuccess, joinRoomFailed, updatePlayerList, selectPlayerGameBoard, setBoard } from '../../store/gameSlice';

function Play() {
   const dispatch = useDispatch();
   const { roomName, username } = useParams();
   const roomStatus = useSelector(selectRoomStatus);
   const errorMessage = useSelector(selectRoomError);

   useEffect(() => {
      socket.on('join_room_success', (data) => {
         dispatch(joinRoomSuccess(data));
       });
     
       socket.on('join_room_failed', (data) => {
         dispatch(joinRoomFailed(data));
       });
     
       socket.on('update_player_list', (data) => {
         dispatch(updatePlayerList(data));
       });

       return () => {
         socket.off('join_room_success');
         socket.off('join_room_failed');
         socket.off('update_player_list');
         // socket.off('player_left_room');
       };
     }, [dispatch, socket]);

   // // Inputs
   // const handleUserInput = (event) => {
   //    if (event.key == "ArrowUp") {
   //       dispatch(rotatePiece());
   //    }
   // };

   // useEffect(() => {
   //    window.addEventListener("keydown", handleUserInput);
   //    return () => {
   //       window.removeEventListener("keydown", handleUserInput);
   //    };
   // }, [dispatch]);

   // Room connexion
   useEffect(() => {
      socket.emit("room_join", { roomName, username});
      return () => {
            socket.emit("room_exit");
      }
   }, []);

   if (roomStatus == "pending") {
      return (
         <>
            <h2>Game compo test</h2>
         </>
      );
   }

   if (roomStatus == "error") {
      return (
         <>
            <h2>Game compo test</h2>
            <h3>Error Joining Room</h3>
            <p style={{ color: "red" }}>Could not join room '{roomName}'.</p>
            <p style={{ color: "red" }}>Reason: {errorMessage}</p>
         </>
      );
   }

   return (
      <>
         <h2>Game compo test</h2>
         <Board/>
      </>
   );
}

export default Play;
