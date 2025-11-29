import React, { useEffect, useState } from "react";
import { Flex, VStack, Input, Button, Text, Tag } from "@chakra-ui/react";
import { showToast } from "../utils/Toast";
import { ArrowRightIcon } from "@chakra-ui/icons";

function Register() {
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const [input, setInput] = useState("");

    function sendUsername() {
        if (!input)
            return showToast("Error", "Enter an username please", "error");
        localStorage.setItem("username", input);
    }

    function disconnect() {
        localStorage.removeItem("username");
        setUsername(null);
        setInput("");
    }

    useEffect(() => {
        sendUsername();
    }, [input]);

    return (
        <Input
            placeholder="Type your username"
            value={input}
            onChange={(event) => setInput(event.target.value)}
        />
    );
}

export default Register;
