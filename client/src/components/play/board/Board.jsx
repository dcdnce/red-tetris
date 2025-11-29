import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { VStack, Grid, Text, Badge, HStack } from "@chakra-ui/react";
import { selectPlayers } from "../../../store/gameSlice";
import { Block } from "./Block";

function Board({ player, isLocalPlayer }) {
    const { roomName } = useParams();
    if (!player) {
        return null;
    }
    const gameBoard = player.board;

    // Build blocks array
    const allBlocks = [];
    for (let i = 0; i < 22; i++) {
        for (let j = 0; j < 10; j++) {
            allBlocks.push({ row: i, col: j, id: gameBoard[i][j] });
        }
    }

    // Opponent
    if (!isLocalPlayer) {
        return (
            <VStack
                width={{ base: "100px", md: "120px", lg: "150px" }}
                align="stretch"
                spacing={2}
            >
                <HStack display="flex" justifyContent="space-between">
                    <Badge variant="solid" fontSize="xs" p="1">
                        {player.username}
                    </Badge>
                </HStack>

                <Grid
                    templateColumns="repeat(10, 1fr)"
                    templateRows="repeat(22, 1fr)"
                    aspectRatio="10/22"
                    width="100%"
                    boxShadow="0px 0px 1px"
                    opacity={0.8}
                >
                    {allBlocks.map((block) => (
                        <Block
                            key={`${block.row}-${block.col}`}
                            row={block.row}
                            col={block.col}
                            id={block.id}
                            player={player}
                        />
                    ))}
                </Grid>
            </VStack>
        );
    }

    // Local player
    return (
        <VStack
            width={{ base: "200px", md: "250px", lg: "300px" }}
            align="stretch"
        >
            <HStack display="flex" justifyContent="space-between">
                <Badge colorScheme="purple" variant="solid" fontSize="lg">
                    {player.username}
                </Badge>
                {/* Affichez ici toutes les infos de debug ou de jeu pour le joueur local */}
                {/* <Text>Score: {player.score}</Text> */}
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
                        player={player}
                    />
                ))}
            </Grid>
        </VStack>
    );
}

export default Board;
