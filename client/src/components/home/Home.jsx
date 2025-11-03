import { Flex, HStack, VStack } from "@chakra-ui/react";
import JoinButton from "./JoinButton.jsx";
import Register from "./Register";
import Header from "../ui/Header.jsx";
import AllRoom from "./AllRoom.jsx";

function Home() {
    return (
        <>
            <Flex justifyContent={"space-between"} marginY={"1rem"}>
                <Header />
                <VStack>
                    <Register />
                    <JoinButton />
                </VStack>
            </Flex>
            <AllRoom />
        </>
    );
}

export default Home;
