import { useEffect, useState } from "react";
import { socket } from "../../socket.js";
import styles from "../../styles/home/AllRoom.module.css";

export default function AllRoom() {

    const [allRoom, setAllRoom] = useState([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        socket.emit("get_all_room", (response) => {
            if (response.success) {
                setAllRoom(response.rooms);
            }
            console.log(allRoom);
        })
        setRefresh(false)
    }, [refresh])

    return (
        <>
            <button className={styles.refresh} onClick={() => {setRefresh(true)}}>refresh</button>
            <div className={styles.container}>
                {allRoom.length ? (allRoom.map((room, index) =>(
                    <div key={index} className={styles.case}>
                        <div className={styles.caseHeader}>
                            <p>{room.roomName}</p>
                            <button className={styles.join}>JOIN</button>
                        </div>
                        <p>{`${room.playerCount} players`}</p>
                    </div>
                ))) : (
                    <p>No room available</p>
                )}
            </div>
        </>
    )
}