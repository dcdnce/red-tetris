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

export function useRoomSocketHandlers() {
    const dispatch = useDispatch();
    const dispatchRef = useRef(dispatch);

    // Keep dispatch ref up to date
    useEffect(() => {
        dispatchRef.current = dispatch;
    }, [dispatch]);

    useEffect(() => {
        // Define handlers that use the ref
        const handleJoinSuccess = (data) => {
            if (data.token) {
                localStorage.setItem(
                    `${data.username}${data.roomName}`,
                    data.token
                );
            }
            dispatchRef.current(joinRoomSuccess(data));
        };

        const handleJoinFailed = (data) => {
            dispatchRef.current(joinRoomFailed(data));
        };

        const handleUpdateGameData = (data) => {
            dispatchRef.current(updateGameData(data));
        };

        const handleRoomLaunchFailed = (data) => {};

        const handleRoomLaunchSuccess = (data) => {
            dispatchRef.current(roomLaunchSuccess(data));
        };

        // Subscribe once
        socket.on("join_room_success", handleJoinSuccess);
        socket.on("join_room_failed", handleJoinFailed);
        socket.on("update_game_data", handleUpdateGameData);
        socket.on("room_launch_failed", handleRoomLaunchFailed);
        socket.on("room_launch_success", handleRoomLaunchSuccess);

        // Cleanup on unmount only
        return () => {
            socket.off("join_room_success", handleJoinSuccess);
            socket.off("join_room_failed", handleJoinFailed);
            socket.off("update_game_data", handleUpdateGameData);
            socket.off("room_launch_failed", handleRoomLaunchFailed);
            socket.off("room_launch_success", handleRoomLaunchSuccess);
        };
    }, []); // Empty deps - subscribe once, cleanup on unmount
}
