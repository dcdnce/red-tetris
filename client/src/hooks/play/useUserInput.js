import { useEffect, useCallback, useRef } from "react"; // Importer useRef et useCallback
import { socket } from "../../socket.js";
import { kStartedState } from "../../services/constants.js";

const isTetrisInput = (key) => {
    return (
        key === "ArrowUp" ||
        key === "ArrowRight" ||
        key === "ArrowLeft" ||
        key === "ArrowDown" ||
        key === "z" ||
        key === "x" ||
        key === " "
    );
};

export function useUserInput(roomName, username, roomState) {
    const roomStateRef = useRef(roomState);

    useEffect(() => {
        // RoomState ref
        roomStateRef.current = roomState;
    }, [roomState]);

    const emitUserInput = useCallback(
        (event) => {
            const key = event.key;

            if (isTetrisInput(key) && roomStateRef.current === kStartedState) {
                const token =
                    localStorage.getItem(`${username}${roomName}`) || null;
                socket.emit("user_input", { roomName, username, token, key });
            }
        },
        [roomName, username]
    ); // [US-54] Stable values

    useEffect(() => {
        window.addEventListener("keydown", emitUserInput);

        return () => {
            window.removeEventListener("keydown", emitUserInput);
        };
    }, [emitUserInput]);
}
