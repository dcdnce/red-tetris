import React, { useState } from "react";
import roomLaunchGameService from "../../services/roomLaunchGameService";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsRoomLeader, selectRoomState } from "../../store/gameSlice";
import { kStartedState } from "../../services/constants";

function RoomLeaderDashboard() {
    const { roomName, username } = useParams();
    const roomState = useSelector(selectRoomState);
    const isRoomLeader = useSelector(selectIsRoomLeader(username));

    const handleClick = () => {
        roomLaunchGameService(roomName, username);
    };

    if (roomState == kStartedState || isRoomLeader == false) {
        return <></>;
    }

    return (
        <>
            <button id="RoomLeaderDashboard" onClick={handleClick}>
                Launch game
            </button>
        </>
    );
}

export default RoomLeaderDashboard;
