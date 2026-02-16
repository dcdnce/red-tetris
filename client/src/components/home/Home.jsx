import { Flex, VStack, HStack } from "@chakra-ui/react";
import Header from "../ui/Header.jsx";
import JoinButton from "./JoinButton";
import { TopTen } from "./Leaderboard.jsx";
import { Rules } from "./Rules.jsx";

function Home() {
    return (
        <>
            <Flex
                justifyContent={"center"}
                alignItems={"center"}
                minH={"100vh"}
                gap="2rem"
            >
                <VStack>
                    <HStack minW="100%" h="120%" minH={"100%"}>
                        <Header isHome={true} />
                    </HStack>
                    <HStack>
                        <VStack>
                            <VStack
                                border={"solid 2px white"}
                                borderRadius={"5px"}
                                padding={"2rem"}
                                backgroundColor={"white"}
                                boxShadow="0 4px 8px rgba(0,0,0,0.2)"
                                alignContent={"top"}
                                minW="100%"
                            >
                                <JoinButton />
                            </VStack>
                            <Rules />
                        </VStack>
                        <TopTen />
                    </HStack>
                </VStack>
            </Flex>
        </>
    );
}

export default Home;
