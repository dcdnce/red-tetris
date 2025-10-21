import { useEffect } from "react";
import { socket } from "../../socket.js";
import { kStartedState } from "../../services/constants.js";

const isTetrisInput = (key) => {
    return (
        key === "ArrowUp" ||
        key === "ArrowRight" ||
        key === "ArrowLeft" ||
        key === "ArrowDown" ||
        key === "z" ||
        key === "x"
    );
};

export function useUserInput(roomName, username, roomState) {
    const emitUserInput = (event) => {
        const key = event.key;

        if (isTetrisInput(key) && roomState === kStartedState) {
            const token =
                localStorage.getItem(`${username}${roomName}`) || null;

            socket.emit("user_input", { roomName, username, token, key });
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", emitUserInput);

        return () => {
            window.removeEventListener("keydown", emitUserInput);
        };
    }, [roomName, username, roomState]);
}
