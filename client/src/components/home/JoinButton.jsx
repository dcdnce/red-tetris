import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Flex } from "@chakra-ui/react";
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
        <Flex width={"100%"} gap="3px">
            <Input
                placeholder="Room"
                value={roomName}
                maxW={"33%"}
                onChange={(e) => setRoomName(e.target.value)}
                autoFocus
            />
            <Button onClick={joinRoom} variant="red_tetris_default">
                PLAY
            </Button>
        </Flex>
    );
}
