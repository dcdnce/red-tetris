import { Block } from "../block/Block.jsx";
import { Box, Grid, VStack, HStack, Text, useToken } from "@chakra-ui/react";
import { AnimatedNumber, useValueDelta } from "../BoardEffects.jsx";

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
            width={{
                md: "40",
                lg: "24",
            }}
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

function Stats({ piecesPerSecond, linesCleared }) {
    const [green, purple, red] = useToken("colors", [
        "green.600",
        "purple.400",
        "red.600",
    ]);
    const lcDelta = useValueDelta(linesCleared);
    const lcColor = lcDelta >= 3 ? purple : lcDelta >= 1 ? green : "black";
    const psDelta = useValueDelta(piecesPerSecond);
    const psColor = psDelta < 0 ? red : "black";

    return (
        <Box
            bg="whiteAlpha.400"
            borderRadius="3"
            width={{
                md: "40",
                lg: "24",
            }}
            p={1}
            cursor="default"
        >
            <HStack justify="space-between">
                <Text fontSize="10" opacity={0.6}>
                    p/s
                </Text>
                <AnimatedNumber value={piecesPerSecond} color={psColor} />
            </HStack>

            <HStack justify="space-between">
                <Text fontSize="10" opacity={0.6}>
                    lines cleared
                </Text>
                <AnimatedNumber
                    value={linesCleared}
                    color={lcColor}
                    duration={0.3}
                />
            </HStack>
        </Box>
    );
}

export function BoardSidebar({ player }) {
    const nextPiece = player.nextPiece;
    const piecesPerSecond = player.piecesPerSecond;
    const linesCleared = player.linesCleared;

    return (
        <Box ml={4}>
            {/* <VStack mt={{ md: "16", lg: "14", xl: "12" }} mr={2} spacing={2}> */}
            <VStack mr={2} spacing={2}>
                <NextPiece nextPiece={nextPiece} />
                <Stats
                    piecesPerSecond={piecesPerSecond}
                    linesCleared={linesCleared}
                />
            </VStack>
        </Box>
    );
}
