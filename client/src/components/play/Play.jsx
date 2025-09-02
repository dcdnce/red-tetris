import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Board from "./Board";
import {
   selectRoomStatus,
   selectRoomError,
   selectPlayersInRoom,
} from "../../store/gameSlice";
import { useRoomSocketHandlers } from "../../hooks/useRoomSocketHandlers.js";
import { useRoomJoin } from "../../hooks/useRoomJoin.js";

function Play() {
   const { roomName, username } = useParams();
   const roomStatus = useSelector(selectRoomStatus);
   const errorMessage = useSelector(selectRoomError);
   const playersInRoom = useSelector(selectPlayersInRoom);

   useRoomSocketHandlers(roomName, username);
   useRoomJoin(roomName, username);

   if (roomStatus === "pending") {
      return <h2>Game compo test</h2>;
   }

   if (roomStatus === "error") {
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
         {playersInRoom.map((_, index) => (
            <Board key={index} number={index} />
         ))}
      </>
   );
}

export default Play;

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
