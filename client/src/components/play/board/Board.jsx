import React from "react";
import { VStack, Grid, Badge, HStack, Flex, Tooltip } from "@chakra-ui/react";
import { Block } from "./Block";
import { Keys } from "./Keys";
import RoomLeaderDashboard from "../RoomLeaderDashboard";
import { ConnexionStatusBadge, RoomLeaderBadge } from "./RoomBadges";
import { useAsyncError } from "react-router-dom";

function Board({ player, isLocalPlayer }) {
    if (!player) {
        return null;
    }

    const gameBoard = player.board;
    const username = player.username;

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
                spacing={1}
            >
                <HStack
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-end"
                    px="0.4"
                >
                    <Badge variant="solid" fontSize="xx-small" p="1">
                        {username}
                    </Badge>
                    <RoomLeaderBadge username={username} />
                    <ConnexionStatusBadge isConnected={player.isConnected} />
                </HStack>

                <Grid
                    templateColumns="repeat(10, 1fr)"
                    templateRows="repeat(22, 1fr)"
                    aspectRatio="10/22"
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
            <HStack
                display="flex"
                justifyContent="space-between"
                alignItems="flex-end"
            >
                <Badge colorScheme="purple" variant="solid" fontSize="lg">
                    {username}
                </Badge>
                <RoomLeaderDashboard />
                <RoomLeaderBadge username={username} />
                <ConnexionStatusBadge isConnected={player.isConnected} />
                {/* Affichez ici toutes les infos de debug ou de jeu pour le joueur local */}
                {/* <Text>Score: {player.score}</Text> */}
            </HStack>

            <Grid
                templateColumns="repeat(10, 1fr)"
                templateRows="repeat(22, 1fr)"
                aspectRatio="10/22"
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

            <Flex justifyContent="space-between" flexDirection="row-reverse">
                <Keys></Keys>
            </Flex>
        </VStack>
    );
}

export default Board;
