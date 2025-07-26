import { useEffect, useState } from "react";
import { socket } from "../../socket.js";

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
            <div className="d-flex d-column">
                {allRoom.map((room) =>(
                    <div>
                        <p>{room.roomName}</p>
                    </div>
                ))}
            </div>
            <button onClick={() => {setRefresh(true)}}>refresh</button>
        </>
    )
}