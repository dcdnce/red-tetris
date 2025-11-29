import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { VStack, Grid, Text, Badge, HStack } from "@chakra-ui/react";
import { selectPlayers } from "../../../store/gameSlice";
import { Block } from "./Block";

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
        <VStack width={{ base: "200px", md: "250px", lg: "300px" }} align="stretch">
            <HStack display="flex" justifyContent="space-between">
                <Badge colorScheme="purple" variant="solid" fontSize="lg">
                    {player.username}
                </Badge>
                {/* <Text fontSize="sm" color="gray.600">
                    (debug) Remaining EPL Inputs: {player.remainingEPLInputs}
                </Text>
                <Text fontSize="sm" color="gray.600">
                    (debug) Current tetrimino: {player.tetriminoType}
                </Text> */}
            </HStack>

            <Grid
                templateColumns="repeat(10, 1fr)"
                templateRows="repeat(22, 1fr)"
                aspectRatio="10/22"
                width="100%"
                boxShadow="0px 0px 2px "
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
