import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, HStack } from "@chakra-ui/react";
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
        <HStack spacing={2}>
            <Input
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                autoFocus
                maxWidth="200px"
            />
            <Button
                bg="brand.500"
                color="white"
                _hover={{ bg: "brand.600" }}
                onClick={joinRoom}
            >
                Join
            </Button>
        </HStack>
    );
}
