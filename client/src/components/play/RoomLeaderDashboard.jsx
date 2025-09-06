import React from "react";
import roomLaunchGameService from "../../services/roomLaunchGameService";
import { useParams } from "react-router-dom";

function RoomLeaderDashboard() {
   const { roomName, username } = useParams();

   const handleClick = () => {
      roomLaunchGameService(roomName, username);
   };

   return (
      <>
         <button id="RoomLeaderDashboard" onClick={handleClick}>
            Launch game
         </button>
      </>
   );
}

export default RoomLeaderDashboard;
