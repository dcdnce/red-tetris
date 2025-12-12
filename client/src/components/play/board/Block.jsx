import React from "react";
import { Box } from "@chakra-ui/react";

const blockColors = {
    0: "beige",
    1: "purple.50",
    2: "cyan.50",
    3: "yellow.50",
    4: "orange.50",
    5: "blue.50",
    6: "red.50",
    7: "green.50",
    8: "gray",
    9: "beige",
};

export function Block({ row, col, id, player, variant }) {
    let bgColor = blockColors[id];

    // Variant
    if (variant === "Board" && id) {
        if (player?.didLost) {
            bgColor = "red.600";
        }
        if (row < 2) {
            bgColor = "gray.100";
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
                    borderRadius="100%"
                    height="25%"
                    margin="auto"
                    position="relative"
                    top="35%"
                ></Box>
            ) : null}
        </Box>
    );
}
