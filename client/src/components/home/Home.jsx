import { Flex, VStack } from "@chakra-ui/react";
import Register from "./Register";
import Header from "../ui/Header.jsx";
import JoinButton from "./JoinButton";

function Home() {
    return (
        <>
            <Flex justifyContent={"center"} alignItems={"center"} minH={"80vh"}>
                <VStack>
                    <Header />
                    <VStack
                        border={"solid 2px white"}
                        borderRadius={"5px"}
                        padding={"2rem"}
                        backgroundColor={"white"}
                        boxShadow="0 4px 8px rgba(0,0,0,0.2)"
                    >
                        <Register />
                        <JoinButton />
                    </VStack>
                </VStack>
            </Flex>
        </>
    );
}

export default Home;
