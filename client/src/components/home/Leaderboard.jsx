import { socket } from "../../socket";
import { useEffect, useState } from "react";
import { Box, VStack, Text, Flex } from "@chakra-ui/react";

export function TopTen() {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        socket.emit("get_best_score", {}, (response) => {
            if (response.success) {
                console.log(response.scores);
                setScores(response.scores);
            } else {
                console.error("Error fetching scores:", response.error);
            }
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <Text>Loading scores...</Text>;
    }

    return (
        <Box borderRadius="5px" p="1rem" backgroundColor="rgba(255, 255, 255, 0.24)" boxShadow="0 4px 8px rgba(0,0,0,0.2)">
            <VStack spacing={"1 rem"} align="stretch">
                <Text textAlign="center" size={"lg"} textShadow={"px 1px 10px"}>leaderboard</Text>
                {scores.map((s, idx) => (
                    <Flex>
                        <Text pr="1rem" fontSize={"md"}>
                            <strong>#{idx + 1}</strong>
                        </Text>
                        <Text key={s.id} fontSize="md">
                            {s.score} pts - {s.username}
                        </Text>
                    </Flex>
                ))}
            </VStack>
        </Box>
    );
}
