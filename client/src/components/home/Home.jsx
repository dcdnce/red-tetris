import { Flex, VStack } from "@chakra-ui/react";
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
                minH={"80vh"}
                gap="2rem"
            >
                <VStack>
                    <Header isHome={true} />
                    <VStack
                        border={"solid 2px white"}
                        borderRadius={"5px"}
                        padding={"2rem"}
                        backgroundColor={"white"}
                        boxShadow="0 4px 8px rgba(0,0,0,0.2)"
                    >
                        <JoinButton />
                    </VStack>
                </VStack>
                <VStack alignContent={"top"}>
                    <TopTen />
                </VStack>
                <VStack alignContent={"top"}>
                    <Rules />
                </VStack>
            </Flex>
        </>
    );
}

export default Home;
