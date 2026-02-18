import { socket } from "../../socket";
import { useEffect, useState } from "react";
import { Box, VStack, Text, Flex, Spinner, Grid } from "@chakra-ui/react";

export function TopTen() {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        socket.emit("get_best_score", {}, (response) => {
            if (response.success) {
                setScores(response.scores);
            } else {
                console.error("Error fetching scores:", response.error);
            }
            setLoading(false);
        });
    }, []);

    return (
        <Box
            borderRadius="5px"
            p="1rem"
            backgroundColor="rgba(255, 255, 255, 0.24)"
            boxShadow="0 4px 8px rgba(0,0,0,0.2)"
            minW="400px"
        >
            <VStack spacing={"1 rem"} alignItems={"center"}>
                <Text
                    textAlign="left"
                    fontSize={"2.25rem"}
                    fontWeight={"bold"}
                    textShadow={"px 1px 10px"}
                    paddingX="1rem"
                >
                    leaderboard
                </Text>
                {loading ? (
                    <Spinner></Spinner>
                ) : (
                    scores.map((s, idx) => (
                        <Grid
                            key={s.id}
                            templateColumns="3rem 1fr"
                            gap={2}
                            width="100%"
                            paddingX="2rem"
                            py={"0.11rem"}
                            borderBottom={"solid 1px"}
                        >
                            <Text fontSize="md" textAlign="left">
                                <strong>#{idx + 1}</strong>
                            </Text>
                            <Text fontSize="md" isTruncated>
                                {s.score} pts - {s.username}
                            </Text>
                        </Grid>
                    ))
                )}
            </VStack>
        </Box>
    );
}
