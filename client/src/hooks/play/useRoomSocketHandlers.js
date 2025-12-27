// hooks/useRoomSocketHandlers.js
import { useEffect, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { socket } from "../../socket";
import {
    joinRoomSuccess,
    joinRoomFailed,
    updateGameData,
    roomLaunchSuccess,
} from "../../store/gameSlice";

export function useRoomSocketHandlers() {
    const dispatch = useDispatch();
    // const initialJoinSentRef = useRef(false);

    // [US-54] useCallback is a React Hook that lets you cache a function definition between re-renders.
    const handleJoinSuccess = useCallback(
        (data) => {
            if (data.token) {
                localStorage.setItem(
                    `${data.username}${data.roomName}`,
                    data.token
                );
            }
            dispatch(joinRoomSuccess(data));

            // if (!initialJoinSentRef.current) {
            //     socket.emit("room_join", { roomName, username, token });
            //     initialJoinSentRef.current = true;
            // } // TODO verify this thing is really necessary or not
        },
        [dispatch]
    );

    const handleJoinFailed = useCallback(
        (data) => {
            dispatch(joinRoomFailed(data));
        },
        [dispatch]
    );

    const handleUpdateGameData = useCallback(
        (data) => {
            dispatch(updateGameData(data));
        },
        [dispatch]
    );

    const handleRoomLaunchFailed = useCallback((data) => {
        console.log(data.error); // TODO launch a toast
    }, []);

    const handleRoomLaunchSuccess = useCallback(
        (data) => {
            dispatch(roomLaunchSuccess(data));
        },
        [dispatch]
    );

    useEffect(() => {
        socket.on("join_room_success", handleJoinSuccess);
        socket.on("join_room_failed", handleJoinFailed);
        socket.on("update_game_data", handleUpdateGameData);
        socket.on("room_launch_failed", handleRoomLaunchFailed);
        socket.on("room_launch_success", handleRoomLaunchSuccess);

        return () => {
            socket.off("join_room_success", handleJoinSuccess);
            socket.off("join_room_failed", handleJoinFailed);
            socket.off("update_game_data", handleUpdateGameData);
            socket.off("room_launch_failed", handleRoomLaunchFailed);
            socket.off("room_launch_success", handleRoomLaunchSuccess);
        };
    }, [
        handleJoinSuccess,
        handleJoinFailed,
        handleUpdateGameData,
        handleRoomLaunchFailed,
        handleRoomLaunchSuccess,
    ]);
}
