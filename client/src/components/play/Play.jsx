import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
    Box,
    Heading,
    Text,
    VStack,
    SimpleGrid,
    HStack,
    Flex,
    useBreakpointValue,
    Badge,
} from "@chakra-ui/react";
import Board from "./board/Board";
import RoomLeaderDashBoard from "./RoomLeaderDashboard.jsx";
import {
    selectRoomState,
    selectRoomError,
    selectPlayers,
} from "../../store/gameSlice";
import { useRoomSocketHandlers } from "../../hooks/play/useRoomSocketHandlers.js";
import { useRoomJoin } from "../../hooks/play/useRoomJoin.js";
import { useUserInput } from "../../hooks/play/useUserInput.js";

function Play() {
    const { roomName, username } = useParams();
    const roomState = useSelector(selectRoomState(roomName));
    const errorMessage = useSelector(selectRoomError(roomName));
    const players = useSelector(selectPlayers(roomName));
    const localPlayer = players?.find((p) => p.username === username);
    const opponents = players?.filter((p) => p.username !== username);
    const isMobile = useBreakpointValue({ base: true, md: false });

    useRoomSocketHandlers(roomName, username);
    useRoomJoin(roomName, username);
    useUserInput(roomName, username, roomState);

    if (roomState === "loading") {
        return (
            <Box textAlign="center" py={10}>
                <Heading>Loading Game...</Heading>
            </Box>
        );
    }

    if (roomState === "error") {
        return (
            <VStack spacing={4} align="center" py={10}>
                <Badge variant="subtle" fontSize="24px" colorScheme="red">
                    Error joining room '{roomName}'
                </Badge>
                <Text fontSize="16px" textAlign="center">
                    {errorMessage}
                </Text>
            </VStack>
        );
    }

    if (isMobile && roomState !== "error") {
        return (
            <VStack spacing={4} align="center" py={10}>
                <Badge variant="subtle" fontSize="24px" colorScheme="red">
                    Unsupported Screen Size
                </Badge>
                <Text fontSize="16px" textAlign="center">
                    This game is best experienced on a larger screen.
                </Text>
            </VStack>
        );
    }

    return (
        <VStack spacing={8} align="stretch" p={4}>
            <HStack display="flex" justifyContent="space-between">
                <Heading>Room: {roomName}</Heading>
                <RoomLeaderDashBoard />
            </HStack>

            <Flex
                direction={{ base: "column", md: "row" }}
                justifyContent="center"
                align="center"
            >
                {/* --- Player zone --- */}
                <Box flex={2} display="flex" justifyContent="center">
                    {localPlayer && (
                        <Board
                            key={localPlayer.username}
                            player={localPlayer}
                            isLocalPlayer={true}
                        />
                    )}
                </Box>

                {/* --- Opponents zone --- */}
                {opponents && opponents.length > 0 && (
                    <VStack
                        flex={1}
                        spacing={4}
                        borderLeftWidth={{ md: "1px" }}
                    >
                        {opponents.map((opponent) => (
                            <Board
                                key={opponent.username}
                                player={opponent}
                                isLocalPlayer={false}
                            />
                        ))}
                    </VStack>
                )}
            </Flex>
        </VStack>
    );
}

export default Play;
