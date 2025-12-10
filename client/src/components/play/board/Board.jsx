import React from "react";
import { VStack, Grid, Flex, HStack } from "@chakra-ui/react";
import { Block } from "./Block";
import { Keys } from "./Keys";
import { BoardHeader } from "./BoardHeader";

function Board({ player, isLocalPlayer }) {
    const board = player.board;
    const boardFull = player.boardFull;
    const allBlocks = [];

    if (!player) {
        return null;
    }

    // Board for opponent
    if (isLocalPlayer == false) {
        let colHi = Array(10).fill(23);

        // Craft spectrum (this is so so stupid and useless)
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 22; y++) {
                if (board[y][x] != 0) {
                    colHi[x] = y;
                    break;
                }
            }
        }

        // Build blocks array
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 22; y++) {
                let currentBlock = y >= colHi[x] ? 8 : 0;
                allBlocks.push({ row: y, col: x, id: currentBlock });
            }
        }
    }

    // Board for local player
    if (isLocalPlayer) {
        // Build blocks array
        for (let i = 0; i < 22; i++) {
            for (let j = 0; j < 10; j++) {
                allBlocks.push({ row: i, col: j, id: boardFull[i][j] });
            }
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
                <BoardHeader player={player} isLocalPlayer={isLocalPlayer} />

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
            <BoardHeader player={player} isLocalPlayer={isLocalPlayer} />

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
