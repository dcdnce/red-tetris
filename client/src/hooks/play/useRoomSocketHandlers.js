// hooks/useRoomSocketHandlers.js
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { socket } from "../../socket";
import {
    joinRoomSuccess,
    joinRoomFailed,
    updatePlayerList,
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

        socket.on("join_room_success", handleJoinSuccess);
        socket.on("join_room_failed", handleJoinFailed);
        socket.on("update_player_list", handleUpdatePlayerList);

        return () => {
            socket.off("join_room_success", handleJoinSuccess);
            socket.off("join_room_failed", handleJoinFailed);
            socket.off("update_player_list", handleUpdatePlayerList);
        };
    }, [dispatch, roomName, username]);
}
