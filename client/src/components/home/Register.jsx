import React, { useState } from "react";
import { Box, VStack, Input, Button, Text, Tag } from "@chakra-ui/react";
import { showToast } from "../utils/Toast";

function Register() {
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const [input, setInput] = useState("");

    function sendUsername() {
        if (!input)
            return showToast("Error", "Enter an username please", "error");
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
            <Tag variant="blueW100">
                <VStack spacing={3}>
                    <Input
                        placeholder="Type your username"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                    />
                    <Button onClick={sendUsername} variant="molle">
                        Register
                    </Button>
                </VStack>
            </Tag>
        );
    }

    return (
        <Tag variant="blueW100">
            <VStack spacing={3}>
                <Text fontSize="1.2rem" fontWeight="bold">
                    Hello <strong>{username}</strong>
                </Text>
                <Button variant="molle" onClick={disconnect}>
                    Disconnect
                </Button>
            </VStack>
        </Tag>
    );
}

export default Register;
