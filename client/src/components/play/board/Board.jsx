import React from "react";
import { VStack, Grid, Flex } from "@chakra-ui/react";
import { Block } from "./block/Block";
import { Keys } from "./layout/Keys";
import { BoardHeader } from "./layout/BoardHeader";
import { BoardSidebar } from "./layout/BoardSidebar";
import { motion } from "framer-motion";
import { shakeAnimation, useShake } from "./BoardEffects";

const MotionVStack = motion.create(VStack);

function Board({ player, isLocalPlayer }) {
    const { isShaking, onAnimationComplete } = useShake(player.username);
    const board = player.board;
    const boardFull = player.boardFull;
    const allBlocks = [];

    if (!player) {
        return null;
    }

    buildAllBlocks(isLocalPlayer, board, boardFull, allBlocks);

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
                            variant={"Board"}
                        />
                    ))}
                </Grid>
            </VStack>
        );
    }

    // Local player
    return (
        <Flex direction="row" align="flex-start">
            <BoardSidebar player={player} />

            {/* Fixed-width game column */}
            <MotionVStack
                align="stretch"
                flexShrink={0} // prevents it from shrinking when NextPiece is present
                variants={shakeAnimation}
                animate={isShaking ? "shake" : "idle"}
                onAnimationComplete={onAnimationComplete}
            >
                <BoardHeader player={player} isLocalPlayer={isLocalPlayer} />

                <Grid
                    templateColumns="repeat(10, 1fr)"
                    templateRows="repeat(22, 1fr)"
                    aspectRatio="10/22"
                    width={{
                        base: "160px",
                        md: "220px",
                        lg: "270px",
                        xl: "300px",
                    }}
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

                <Flex
                    justifyContent="space-between"
                    flexDirection="row-reverse"
                >
                    <Keys />
                </Flex>
            </MotionVStack>
        </Flex>
    );
}

export default Board;

const buildAllBlocks = (isLocalPlayer, board, boardFull, allBlocks) => {
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
};
