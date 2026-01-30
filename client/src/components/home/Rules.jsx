import { Box, VStack, Text, List, ListItem, ListIcon } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

export function Rules() {
    return (
        <Box
            borderRadius="5px"
            p="1.5rem"
            backgroundColor="rgba(255, 255, 255, 0.24)"
            boxShadow="0 4px 8px rgba(0,0,0,0.2)"
            minW="400px"
            maxW="420px"
        >
            <VStack spacing="1rem" alignItems="flex-start">
                <Text
                    fontSize="2.25rem"
                    textShadow="px 1px 10px"
                    fontWeight="bold"
                >
                    rules
                </Text>
                <List spacing={3} fontSize="md">
                    <ListItem display="flex" alignItems="flex-start">
                        <ListIcon
                            as={CheckCircleIcon}
                            color="green.400"
                            mt={1}
                        />
                        <Text fontSize="md">
                            Use arrow keys to move and rotate tetriminos
                        </Text>
                    </ListItem>
                    <ListItem display="flex" alignItems="flex-start">
                        <ListIcon
                            as={CheckCircleIcon}
                            color="green.400"
                            mt={1}
                        />
                        <Text fontSize="md">
                            Complete horizontal lines to clear them and earn
                            points
                        </Text>
                    </ListItem>
                    <ListItem display="flex" alignItems="flex-start">
                        <ListIcon
                            as={CheckCircleIcon}
                            color="green.400"
                            mt={1}
                        />
                        <Text fontSize="md">
                            The game ends when blocks reach the top
                        </Text>
                    </ListItem>
                    <ListItem display="flex" alignItems="flex-start">
                        <ListIcon
                            as={CheckCircleIcon}
                            color="green.400"
                            mt={1}
                        />
                        <Text fontSize="md">
                            In multiplayer, cleared lines add penalty rows to
                            opponents
                        </Text>
                    </ListItem>
                    <ListItem display="flex" alignItems="flex-start">
                        <ListIcon
                            as={CheckCircleIcon}
                            color="green.400"
                            mt={1}
                        />
                        <Text fontSize="md">The last player standing wins</Text>
                    </ListItem>
                </List>
            </VStack>
        </Box>
    );
}
