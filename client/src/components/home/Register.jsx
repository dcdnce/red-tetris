import React, { useState } from "react";
import { Box, VStack, Input, Button, Text } from "@chakra-ui/react";

function Register() {
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const [input, setInput] = useState("");

    function sendUsername() {
        localStorage.setItem("username", input);
        setUsername(input);
        setInput("");
    }

    function disconnect() {
        localStorage.removeItem("username");
        setUsername(null);
        setInput("");
    }

    if (username === null) {
        return (
            <Box
                bg="brand.500"
                color="white"
                padding="1rem"
                borderRadius="5px"
                boxShadow="1px 2px 4px rgba(0, 0, 0, 0.1)"
            >
                <VStack spacing={3}>
                    <Input
                        placeholder="Type your username"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        bg="white"
                        color="black"
                    />
                    <Button
                        bg="blue.500"
                        color="white"
                        _hover={{ bg: "blue.600" }}
                        onClick={sendUsername}
                        width="100%"
                    >
                        Register
                    </Button>
                </VStack>
            </Box>
        );
    }

    return (
        <Box
            bg="brand.500"
            color="white"
            padding="1rem"
            borderRadius="5px"
            boxShadow="1px 2px 4px rgba(0, 0, 0, 0.1)"
        >
            <VStack spacing={3}>
                <Text fontSize="1.2rem" fontWeight="bold">
                    Registered as: <strong>{username}</strong>
                </Text>
                <Button
                    bg="blue.500"
                    color="white"
                    _hover={{ bg: "blue.600" }}
                    onClick={disconnect}
                    width="100%"
                >
                    Disconnect
                </Button>
            </VStack>
        </Box>
    );
}

export default Register;
