import React from "react";
import roomLaunchGameService from "../../../../services/roomLaunchGameService";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    selectIsRoomLeader,
    selectRoomState,
} from "../../../../store/gameSlice";
import {
    kFinishedState,
    kPendingState,
} from "../../../../services/constants";
import { Button } from "@chakra-ui/react";

function RoomLeaderDashboard() {
    const { roomName, username } = useParams();
    const roomState = useSelector(selectRoomState(roomName));
    const isRoomLeader = useSelector(selectIsRoomLeader(roomName, username));
    const handleClick = () => {
        roomLaunchGameService(roomName, username);
    };

    const canStartGame = roomState === kPendingState && isRoomLeader;
    const canReplayGame = roomState === kFinishedState && isRoomLeader;

    if (!canStartGame && !canReplayGame) {
        return null;
    }

    return (
        <Button
            bg="green.50"
            color="black"
            _hover={{ bg: "gray.100" }}
            onClick={handleClick}
            p="2"
            h={"23px"}
            fontSize={"x-small"}
        >
            {canReplayGame ? "Restart ↻" : "Start ▶️"}
        </Button>
    );
}

export default RoomLeaderDashboard;
