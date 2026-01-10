import { Block } from "./Block.jsx";
import React from "react";
import { Box, Grid, VStack } from "@chakra-ui/react";

function NextPiece({ nextPiece }) {
    if (nextPiece === null || nextPiece === undefined) {
        return <></>;
    }

    const allBlocks = [];

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            if (nextPiece[i][j] === 0) continue; // no background
            allBlocks.push({ row: i, col: j, id: nextPiece[i][j] });
        }
    }

    return (
        <Grid
            templateColumns="repeat(3, 1fr)"
            templateRows="repeat(4, 1fr)"
            aspectRatio="3/4"
            bg="whiteAlpha.400"
            borderRadius={3}
            p={1}
            pl={4}
            pt={3}
        >
            {nextPiece &&
                allBlocks.map((block) => (
                    <Block
                        key={`${block.row}-${block.col}`}
                        row={block.row}
                        col={block.col}
                        id={block.id}
                        player={null}
                        variant={"nextPiece"}
                    />
                ))}
        </Grid>
    );
}

function Stats({ piecesDropped, linesCleared }) {
    return (
        <Box bg="whiteAlpha.100" borderRadius="md" p={3}>
            {piecesDropped} <br />
            {linesCleared}
        </Box>
    );
}

export function BoardSidebar({ player }) {
    const nextPiece = player.nextPiece;
    const piecesDropped = player.piecesDropped;
    const linesCleared = player.linesCleared;

    return (
        <Box ml={4}>
            <VStack mt={10} mr={2} spacing={2}>
                <NextPiece nextPiece={nextPiece} />
                <Stats
                    piecesDropped={piecesDropped}
                    linesCleared={linesCleared}
                />
            </VStack>
        </Box>
    );
}
