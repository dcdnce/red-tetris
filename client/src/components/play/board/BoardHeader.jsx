import React from "react";
import { Badge, Flex, HStack, Tooltip } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsRoomLeader } from "../../../store/gameSlice";
import RoomLeaderDashboard from "./RoomLeaderDashboard";

export function BoardHeader({ player, isLocalPlayer }) {
    return (
        <HStack
            display="flex"
            justifyContent="space-between"
            alignItems="flex-end"
        >
            <UsernameBadge
                username={player.username}
                isLocalPlayer={isLocalPlayer}
            />
            <Flex
                justifyContent={"space-between"}
                alignItems={"flex-end"}
                gap={"2"}
            >
                {isLocalPlayer && <RoomLeaderDashboard />}
                <RoomLeaderBadge username={player.username} />
                <ConnexionStatusBadge isConnected={player.isConnected} />
            </Flex>
        </HStack>
    );
}

function UsernameBadge({ username, isLocalPlayer }) {
    const size = isLocalPlayer ? "lg" : "xx-small";
    const p = isLocalPlayer ? null : "1";

    return (
        <Badge colorScheme="purple" variant="solid" fontSize={size} p={p}>
            {username}
        </Badge>
    );
}

function ConnexionStatusBadge({ isConnected }) {
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

function RoomLeaderBadge({ username }) {
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
