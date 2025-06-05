import React, { useState, useEffect } from "react";
import Board from "./Board";
import { rotatePiece } from "../../store/gameSlice";
import { useDispatch } from "react-redux";
import { socket } from "../../socket";
import { useParams } from "react-router-dom";

function Play() {
   const dispatch = useDispatch();
   const { roomName, username } = useParams();
   const [joinStatus, setJoinStatus] = useState("pending");
   const [errorMessage, setErrorMessage] = useState("");

   // Inputs
   const handleUserInput = (event) => {
      if (event.key == "ArrowUp") {
         dispatch(rotatePiece());
      }
   };

   useEffect(() => {
      window.addEventListener("keydown", handleUserInput);
      return () => {
         window.removeEventListener("keydown", handleUserInput);
      };
   }, [dispatch]);

   // Specific room connexion
   useEffect(() => {
      socket.emit("room_join", { roomName, username}, (response) => {
         if (response.success) {
            console.log(response.message);
            setJoinStatus("success");
         } else {
            console.log(response.error);
            setJoinStatus("error");
            setErrorMessage(response.error);
         }
      });

      return () => {
         socket.emit("room_exit");
      };
   }, []);

   if (joinStatus == "pending") {
      return (
         <>
            <h2>Game compo test</h2>
         </>
      );
   }

   if (joinStatus == "error") {
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
         <Board />
      </>
   );
}

export default Play;
