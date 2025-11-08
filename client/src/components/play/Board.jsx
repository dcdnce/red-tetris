import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { VStack, Box, Grid, Text } from "@chakra-ui/react";
import { selectPlayers } from "../../store/gameSlice";

function Block({ row, col, playerNumber }) {
    const { roomName } = useParams();
    const players = useSelector(selectPlayers(roomName));
    const isPlayerConnected = players[playerNumber].isConnected;
    const didPlayerLost = players[playerNumber].didLost;

    let bgColor = "brand.500";
    if (!isPlayerConnected) {
        bgColor = "gray.400";
    }
    if (didPlayerLost) {
        bgColor = "red.600";
    }

    return (
        <Box
            gridRow={row + 1}
            gridColumn={col + 1}
            bg={bgColor}
            borderRadius="2px"
            boxShadow="inset 0 0 2px rgba(0,0,0,0.3)"
        />
    );
}

function Board({ playerNumber }) {
    const { roomName } = useParams();

    const players = useSelector(selectPlayers(roomName));
    const player = players[playerNumber];
    const gameBoard = player.board;

    // Build blocks array
    const allBlocks = [];
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 10; j++) {
            if (gameBoard[i][j] != 0) allBlocks.push({ row: i, col: j });
        }
    }

    return (
        <VStack spacing={2} align="center">
            <Text fontWeight="bold">{player.username}</Text>
            <Text fontSize="sm" color="gray.600">
                (debug) Remaining EPL Inputs: {player.remainingEPLInputs}
            </Text>
            <Text fontSize="sm" color="gray.600">
                (debug) Current tetrimino: {player.tetriminoType}
            </Text>

            <Grid
                templateColumns="repeat(10, 1fr)"
                templateRows="repeat(20, 1fr)"
                gap="1px"
                padding="0.5rem"
                borderRadius="5px"
                boxShadow="1px 2px 4px rgba(0, 0, 0, 0.1)"
                aspectRatio="10/20"
                maxW={{ base: "150px", sm: "200px", md: "250px", lg: "300px" }}
                w="100%"
                bg="beige"
            >
                {allBlocks.map((block) => (
                    <Block
                        key={`${block.row}-${block.col}`}
                        row={block.row}
                        col={block.col}
                        playerNumber={playerNumber}
                    />
                ))}
            </Grid>
        </VStack>
    );
}

export default Board;
