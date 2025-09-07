import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/home/Home.module.css";

export default function JoinButton() {
    const navigate = useNavigate();
    const [roomName, setRoomName] = useState("");

    async function joinRoom() {
        const username = localStorage.getItem("username");

        if (!roomName.trim()) {
            alert("Please enter a room name.");
            return;
        }

        if (username === null) {
            alert("Please register.");
            return;
        }

        navigate(`/${roomName}/${username}`);
    }

    return (
        <>
            <button
                className="button-press button-press-hover card bg-cyan text-cyan"
                onClick={joinRoom}
            >
                Join
                <input
                    className={`${styles.homeInputRoom}`}
                    value={roomName}
                    placeholder="Room Name"
                    onChange={(e) => {
                        setRoomName(e.target.value);
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    autoFocus
                    type="text"
                />
            </button>
        </>
    );
}
