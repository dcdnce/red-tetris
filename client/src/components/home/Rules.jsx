import { Box, VStack, Text, List, ListItem, ListIcon } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

export function Rules() {
    const rules = [
        "Use arrow keys to move and rotate tetriminos",
        "Complete horizontal lines to clear them and earn points",
        "The game ends when blocks reach the top",
        "In multiplayer, cleared lines add penalty rows to opponents",
        "The last player standing wins",
    ];

    return (
        <Box
            borderRadius="5px"
            p="1rem"
            backgroundColor="rgba(255, 255, 255, 0.24)"
            boxShadow="0 4px 8px rgba(0,0,0,0.2)"
            minW="400px"
            maxW="40vw"
        >
            <VStack alignItems="flex-start">
                <Text
                    fontSize="2.25rem"
                    textShadow="px 1px 10px"
                    fontWeight="bold"
                >
                    rules
                </Text>
                <List fontSize="md">
                    {rules.map((r, i) => (
                        <ListItem key={i} display="flex" alignItems="center">
                            <ListIcon
                                as={CheckCircleIcon}
                                color="green.400"
                                mr={2}
                            />
                            <Text fontSize="md">{r}</Text>
                        </ListItem>
                    ))}
                </List>
            </VStack>
        </Box>
    );
}
