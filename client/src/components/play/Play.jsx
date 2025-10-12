import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Board from "./Board";
import RoomLeaderDashBoard from "./RoomLeaderDashboard.jsx";
import {
    selectRoomState,
    selectRoomError,
    selectPlayers,
} from "../../store/gameSlice";
import { useRoomSocketHandlers } from "../../hooks/play/useRoomSocketHandlers.js";
import { useRoomJoin } from "../../hooks/play/useRoomJoin.js";
import { useUserInput } from "../../hooks/play/useUserInput.js";

function Play() {
    const { roomName, username } = useParams();
    const roomState = useSelector(selectRoomState(roomName));
    const errorMessage = useSelector(selectRoomError(roomName));
    const players = useSelector(selectPlayers(roomName));

    useRoomSocketHandlers(roomName, username);
    useRoomJoin(roomName, username);
    useUserInput(roomName, username, roomState);

    if (roomState === "loading") {
        return <h2>Game compo test</h2>;
    }

    if (roomState === "error") {
        return (
            <>
                <h2>Game compo test</h2>
                <h3>Error Joining Room</h3>
                <p style={{ color: "red" }}>
                    Could not join room '{roomName}'.
                </p>
                <p style={{ color: "red" }}>Reason: {errorMessage}</p>
            </>
        );
    }

    return (
        <>
            <h2>Game compo test</h2>
            {players?.map((_, index) => (
                <Board key={index} playerNumber={index} />
            ))}
            <RoomLeaderDashBoard />
        </>
    );
}

export default Play;
