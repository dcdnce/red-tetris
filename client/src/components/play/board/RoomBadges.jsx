import React from "react";
import { Badge, Tooltip } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsRoomLeader } from "../../../store/gameSlice";

export function ConnexionStatusBadge({ isConnected }) {
    if (isConnected === undefined || isConnected === null) {
        return;
    }

    return (
        <>
            {isConnected && (
                <Tooltip label="Connected">
                    <Badge p="1" fontSize="xx-small">
                        🔗
                    </Badge>
                </Tooltip>
            )}
            {!isConnected && (
                <Tooltip label="Disconnected">
                    <Badge p="1" colorScheme="red" fontSize="xx-small">
                        ⛓️‍💥
                    </Badge>
                </Tooltip>
            )}
        </>
    );
}

export function RoomLeaderBadge({ username }) {
    const { roomName } = useParams();
    const isRoomLeader = useSelector(selectIsRoomLeader(roomName, username));

    return (
        <>
            {isRoomLeader && (
                <Tooltip label="Room leader.">
                    <Badge p="1" fontSize="xx-small">
                        👑
                    </Badge>
                </Tooltip>
            )}
        </>
    );
}
