import { Flex, VStack, HStack } from "@chakra-ui/react";
import Register from "./Register";
import Header from "../ui/Header.jsx";
import AllRoom from "./AllRoom.jsx";
import { backgroundImage } from "../../styles/chakra/theme.js";
import JoinButton from "./JoinButton";

function Home() {
    return (
        <>
            <Flex
                justifyContent={"center"}
                alignItems={"center"}
                minH={"80vh"}
            >
                <VStack>
                    <Header />
                    <VStack
                        border={"solid 2px white"}
                        borderRadius={"5px"}
                        padding={"2rem"}
                        backgroundColor={"white"}
                        // backgroundImage={`url(${backgroundImage})`}
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
