import { Badge, Text, VStack } from "@chakra-ui/react";
import React from "react";

export function Error({ errorTitle, errorMessage }) {
    return (
        <VStack spacing={4} align="center" py={10}>
            <Badge variant="subtle" fontSize="24px" colorScheme="red">
                {errorTitle}
            </Badge>
            <Text fontSize="16px" textAlign="center">
                {errorMessage}
            </Text>
        </VStack>
    );
}
