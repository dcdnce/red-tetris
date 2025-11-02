import { Flex, HStack, VStack } from "@chakra-ui/react";
import JoinButton from "./JoinButton.jsx";
import Register from "./Register";
import Header from "../ui/Header.jsx";

function Home() {
    return (
        <>
            <Flex justifyContent={"space-between"}>
                <Header />
                <VStack>
                    <Register />
                    <JoinButton />
                </VStack>
            </Flex>
        </>
    );
}

export default Home;
