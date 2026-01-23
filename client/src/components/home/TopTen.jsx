import { socket } from "../../socket";
import { useEffect, useState } from "react";
import { Box, VStack, Text } from "@chakra-ui/react";

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
        <Box layerStyle={"transparent"}>
            <VStack spacing={2} align="stretch">
                {scores.map((s, idx) => (
                    <Text key={s.id} fontSize="lg">
                        #{idx + 1} {s.score} pts - {s.username} (
                        {s.linesCleared} lines)
                    </Text>
                ))}
            </VStack>
        </Box>
    );
}
