import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Box, Heading, Text, VStack, SimpleGrid } from "@chakra-ui/react";
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
                <Heading>Error Joining Room</Heading>
                <Text color="red.500" fontSize="lg">
                    Could not join room '{roomName}'.
                </Text>
                <Text color="red.500" fontSize="lg">
                    Reason: {errorMessage}
                </Text>
            </VStack>
        );
    }

    return (
        <VStack spacing={4} align="stretch">
            <Heading>Room: {roomName}</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {players?.map((_, index) => (
                    <Board key={index} playerNumber={index} />
                ))}
            </SimpleGrid>
            <RoomLeaderDashBoard />
        </VStack>
    );
}

export default Play;
