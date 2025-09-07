// hooks/useRoomSocketHandlers.js
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { socket } from "../../socket";
import {
    joinRoomSuccess,
    joinRoomFailed,
    updatePlayerList,
    roomLaunchSuccess,
} from "../../store/gameSlice";

export function useRoomSocketHandlers(roomName, username) {
    const dispatch = useDispatch();
    const initialJoinSentRef = useRef(false);

    useEffect(() => {
        const handleJoinSuccess = (data) => {
            dispatch(joinRoomSuccess(data));
            const token = data.token;
            localStorage.setItem(`${data.username}${data.roomName}`, token);

            if (!initialJoinSentRef.current) {
                socket.emit("room_join", { roomName, username, token });
                initialJoinSentRef.current = true;
            }
        };

        const handleJoinFailed = (data) => {
            dispatch(joinRoomFailed(data));
        };

        const handleUpdatePlayerList = (data) => {
            dispatch(updatePlayerList(data));
        };

        const handleRoomLaunchFailed = (data) => {
            console.log(data.error);
        };

        const handleRoomLaunchSuccess = (data) => {
            dispatch(roomLaunchSuccess(data));
        };

        socket.on("join_room_success", handleJoinSuccess);
        socket.on("join_room_failed", handleJoinFailed);
        socket.on("update_player_list", handleUpdatePlayerList);
        socket.on("room_launch_failed", handleRoomLaunchFailed);
        socket.on("room_launch_success", handleRoomLaunchSuccess);

        return () => {
            socket.off("join_room_success", handleJoinSuccess);
            socket.off("join_room_failed", handleJoinFailed);
            socket.off("update_player_list", handleUpdatePlayerList);
            socket.off("room_launch_failed", handleRoomLaunchFailed);
            socket.off("room_launch_success", handleRoomLaunchSuccess);
        };
    }, [dispatch, roomName, username]);
}
