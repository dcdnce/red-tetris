import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Input,
    VStack,
    InputRightElement,
    InputGroup,
} from "@chakra-ui/react";
import { showToast } from "../utils/Toast";

export default function JoinButton() {
    const navigate = useNavigate();
    const [roomName, setRoomName] = useState("");

    async function joinRoom() {
        const username = localStorage.getItem("username");

        if (!roomName.trim()) {
            return showToast("Erreur", "Please enter a room name", "error");
        }

        if (username === null) {
            return showToast("Erreur", "Please register", "error");
        }

        navigate(`/${roomName}/${username}`);
    }

    return (
        <VStack spacing={2}>
            <InputGroup>
                <Input
                    placeholder="Room Name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    autoFocus
                />
                <InputRightElement>
                    <Button
                        bg="brand.500"
                        padding={"1rem"}
                        color="white"
                        onClick={joinRoom}
                    >
                        Join
                    </Button>
                </InputRightElement>
            </InputGroup>
        </VStack>
    );
}
