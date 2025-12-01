import React from "react";
import roomLaunchGameService from "../../../services/roomLaunchGameService";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsRoomLeader, selectRoomState } from "../../../store/gameSlice";
import { kStartedState } from "../../../services/constants";
import { Box, Button } from "@chakra-ui/react";

function RoomLeaderDashboard() {
    const { roomName, username } = useParams();
    const roomState = useSelector(selectRoomState(roomName));
    const isRoomLeader = useSelector(selectIsRoomLeader(roomName, username));

    const handleClick = () => {
        roomLaunchGameService(roomName, username);
    };

    if (roomState == kStartedState || isRoomLeader == false) {
        return null;
    }

    return (
        <Button
            bg="green.50"
            color="black"
            _hover={{ bg: "gray.100" }}
            onClick={handleClick}
            p="3"
        >
            Start ▶️
        </Button>
    );
}

export default RoomLeaderDashboard;
