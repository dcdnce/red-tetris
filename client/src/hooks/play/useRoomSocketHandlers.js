// hooks/useRoomSocketHandlers.js
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { socket } from "../../socket";
import {
    joinRoomSuccess,
    joinRoomFailed,
    updateGameData,
    roomLaunchSuccess,
} from "../../store/gameSlice";

export function useRoomSocketHandlers(roomName, username) {
    const dispatch = useDispatch();
    const initialJoinSentRef = useRef(false);

    useEffect(() => {
        const handleJoinSuccess = (data) => {
            const token = data.token;
            localStorage.setItem(`${data.username}${data.roomName}`, token);
            dispatch(joinRoomSuccess(data));

            if (!initialJoinSentRef.current) {
                socket.emit("room_join", { roomName, username, token });
                initialJoinSentRef.current = true;
            }
        };

        const handleJoinFailed = (data) => {
            dispatch(joinRoomFailed(data));
        };

        const handleUpdateGameData = (data) => {
            dispatch(updateGameData(data));
        };

        const handleRoomLaunchFailed = (data) => {
            console.log(data.error);
        };

        const handleRoomLaunchSuccess = (data) => {
            dispatch(roomLaunchSuccess(data));
        };

        socket.on("join_room_success", handleJoinSuccess);
        socket.on("join_room_failed", handleJoinFailed);
        socket.on("update_game_data", handleUpdateGameData);
        socket.on("room_launch_failed", handleRoomLaunchFailed);
        socket.on("room_launch_success", handleRoomLaunchSuccess);
        socket.on("room_launch_success", handleRoomLaunchSuccess);

        return () => {
            socket.off("join_room_success", handleJoinSuccess);
            socket.off("join_room_failed", handleJoinFailed);
            socket.off("room_launch_failed", handleRoomLaunchFailed);
            socket.off("room_launch_success", handleRoomLaunchSuccess);
        };
    }, [dispatch, roomName, username]);
}
