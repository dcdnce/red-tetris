import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Flex } from "@chakra-ui/react";
import { showToast } from "../utils/Toast";

export default function JoinButton() {
    const navigate = useNavigate();
    const [usernameInput, setUsernameInput] = useState("");
    const [roomName, setRoomName] = useState("");

    function saveUsername() {
        if (!usernameInput)
            return showToast("Error", "Enter an username please", "error");
        localStorage.setItem("username", usernameInput);
    }

    function joinRoom() {
        saveUsername();
        if (!roomName.trim()) {
            return showToast("Erreur", "Please enter a room name", "error");
        }

        navigate(`/${roomName}/${usernameInput}`);
    }

    return (
        <>
            <Input
                placeholder="Type your username"
                value={usernameInput}
                onChange={(event) => setUsernameInput(event.target.value)}
            />
            <Flex width={"100%"} gap="3px">
                <Input
                    placeholder="Room"
                    value={roomName}
                    maxW={"33%"}
                    onChange={(e) => setRoomName(e.target.value)}
                />
                <Button onClick={joinRoom} variant="red_tetris_default">
                    PLAY
                </Button>
            </Flex>
        </>
    );
}
