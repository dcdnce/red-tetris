import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { VStack, Box, Grid, Text } from "@chakra-ui/react";
import { selectPlayers } from "../../store/gameSlice";

const blockColors = {
    0: "beige",
    1: "purple.50",
    2: "cyan.50",
    3: "yellow.50",
    4: "orange.50",
    5: "blue.50",
    6: "red.50",
    7: "green.50",
};

function Block({ row, col, id, playerNumber }) {
    const { roomName } = useParams();
    const players = useSelector(selectPlayers(roomName));
    const isPlayerConnected = players[playerNumber].isConnected;
    const didPlayerLost = players[playerNumber].didLost;

    let bgColor = blockColors[id];

    // Overrides
    if (id) {
        if (!isPlayerConnected) {
            bgColor = "gray.400";
        }
        if (didPlayerLost) {
            bgColor = "red.600";
        }
        if (row < 2) {
            bgColor = "black.500";
        }
    }

    return (
        <Box
            gridRow={row + 1}
            gridColumn={col + 1}
            bg={bgColor}
            textAlign="center"
            boxShadow="inset 0 0 0 0.05px rgba(0,0,0,1)"
        >
            {id ? (
                <Box
                    border="5px solid rgba(0, 0, 0, 0.05)"
                    width="24%"
                    height="25%"
                    margin="auto"
                    position="relative"
                    top="35%"
                ></Box>
            ) : null}
        </Box>
    );
}

function Board({ playerNumber }) {
    const { roomName } = useParams();

    const players = useSelector(selectPlayers(roomName));
    const player = players[playerNumber];
    const gameBoard = player.board;

    // Build blocks array
    const allBlocks = [];
    for (let i = 0; i < 22; i++) {
        for (let j = 0; j < 10; j++) {
            allBlocks.push({ row: i, col: j, id: gameBoard[i][j] });
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
                templateRows="repeat(22, 1fr)"
                borderRadius="2px"
                d
                aspectRatio="10/22"
                maxW={{ base: "150px", sm: "200px", md: "250px", lg: "300px" }}
                w="100%"
            >
                {allBlocks.map((block) => (
                    <Block
                        key={`${block.row}-${block.col}`}
                        row={block.row}
                        col={block.col}
                        id={block.id}
                        playerNumber={playerNumber}
                    />
                ))}
            </Grid>
        </VStack>
    );
}

export default Board;
