import React, { useMemo } from "react";
import { VStack, Grid, Flex } from "@chakra-ui/react";
import { Block } from "./block/Block";
import { Keys } from "./layout/Keys";
import { BoardHeader } from "./layout/BoardHeader";
import { BoardSidebar } from "./layout/BoardSidebar";
import { motion } from "framer-motion";
import { shakeAnimation, useShake } from "./BoardEffects";
import { useAllBlocks } from "../../../hooks/play/useAllBlocks";

const MotionVStack = motion.create(VStack);

function Board({ player, isLocalPlayer }) {
    const { isShaking, onAnimationComplete } = useShake(player.username);

    if (!player) {
        return null;
    }

    //[US-57] useMemo - re renders only if one of the following changes
    const allBlocks = useAllBlocks(isLocalPlayer, player);

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
