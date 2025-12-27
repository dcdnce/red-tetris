import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Box, VStack, HStack, Flex } from "@chakra-ui/react";
import Board from "./board/Board";
import {
    selectRoomState,
    selectRoomError,
    selectPlayers,
} from "../../store/gameSlice";
import { useRoomSocketHandlers } from "../../hooks/play/useRoomSocketHandlers.js";
import { useRoomJoin } from "../../hooks/play/useRoomJoin.js";
import { useUserInput } from "../../hooks/play/useUserInput.js";
import Header from "../ui/Header.jsx";
import { Error } from "../ui/Error.jsx";
import { useIsMobile } from "../../hooks/useIsMobile.js";

function Play() {
    const { roomName, username } = useParams();
    const roomState = useSelector(selectRoomState(roomName));
    const errorMessage = useSelector(selectRoomError(roomName));
    const players = useSelector(selectPlayers(roomName));
    const localPlayer = players?.find((p) => p.username === username);
    const opponents = players?.filter((p) => p.username !== username);
    const isMobile = useIsMobile();

    useRoomSocketHandlers();
    useRoomJoin(roomName, username);
    useUserInput(roomName, username, roomState);

    if (roomState === "error") {
        return (
            <Error
                errorTitle={`Error joining room "${roomName}"`}
                errorMessage={errorMessage}
            />
        );
    } else if (isMobile) {
        return (
            <Error
                errorTitle={"Unsupported Screen Size"}
                errorMessage={
                    "This game is best experienced on a larger screen."
                }
            />
        );
    }

    return (
        <VStack spacing={8} align="stretch" p={4}>
            <HStack display="flex" justifyContent="space-between">
                <Header />
            </HStack>

            <Flex direction="row" justifyContent="center" align="center">
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
