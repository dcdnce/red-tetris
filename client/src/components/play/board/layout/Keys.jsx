import { Badge, Tooltip, Kbd, Text, VStack, HStack } from "@chakra-ui/react";
import React from "react";

const tooltipLabel = (
    <VStack spacing={2} align="stretch" p={2}>
        <HStack justifyContent="space-between">
            <Text fontSize="sm">Move:</Text>
            <HStack color="black">
                <Kbd>◄</Kbd>
                <Kbd>▼</Kbd>
                <Kbd>►</Kbd>
            </HStack>
        </HStack>

        <HStack justifyContent="space-between">
            <Text fontSize="sm">Rotate right:</Text>
            <HStack color="black">
                <Kbd>▲</Kbd>
                <Kbd>x</Kbd>
            </HStack>
        </HStack>

        <HStack justifyContent="space-between">
            <Text fontSize="sm">Rotate left:</Text>
            <HStack color="black">
                <Kbd>z</Kbd>
            </HStack>
        </HStack>

        <HStack justifyContent="space-between">
            <Text fontSize="sm">Hard Drop:</Text>
            <Kbd color="black">space</Kbd>
        </HStack>
    </VStack>
);

export function Keys() {
    return (
        <Tooltip label={tooltipLabel}>
            <Badge cursor="help" fontSize="xx-small" bg="whiteAlpha.400">
                ?
            </Badge>
        </Tooltip>
    );
}
