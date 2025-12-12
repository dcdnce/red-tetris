import { Block } from "./Block.jsx";
import React from "react";
import { Grid } from "@chakra-ui/react";

export function NextPiece({ nextPiece }) {
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
