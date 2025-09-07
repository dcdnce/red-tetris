import { useEffect, useState } from "react";
import { socket } from "../../socket.js";
import styles from "../../styles/home/AllRoom.module.css";
import { useNavigate } from "react-router-dom";

export default function AllRoom() {
    const [allRoom, setAllRoom] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();
    const username = localStorage.getItem("username");

    useEffect(() => {
        socket.emit("get_all_room", (response) => {
            if (response.success) {
                setAllRoom(response.rooms);
            }
            console.log(allRoom);
        });
        setRefresh(false);
    }, [refresh]);

    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            socket.emit("get_room_by_search", { searchValue }, (response) => {
                if (response.success) {
                    setAllRoom(response.rooms);
                } else {
                    console.error("Search error:", response.error);
                }
            });
        }, 300);

        return () => clearTimeout(delayedSearch);
    }, [searchValue]);

    const add = () => {
        for (let i = 0; i < 200; i++) {
            socket.emit(
                "room_join",
                { roomName: `abs${i}`, userName: `abgg${i}` },
                (response) => {
                    if (response.success) {
                        setAllRoom(response.rooms);
                    }
                    console.log(allRoom);
                }
            );
            setRefresh(false);
        }
    };

    const close = () => {
        for (let i = 0; i < 200; i++) {
            socket.emit("exit_all");
            for (let i = 0; i < 200; i++) {
                socket.emit("exit_all");
            }
            setRefresh(false);
        }
        setRefresh(false);
    };

    const join = (room) => {
        navigate(`/${room.roomName}/${username}`);
    };

    return (
        <>
            <input
                placeholder="Search a room"
                onChange={(e) => {
                    setSearchValue(e.target.value);
                }}
            />
            <button
                className={styles.refresh}
                onClick={() => {
                    setRefresh(true);
                }}
            >
                <img src="/icons/refresh.svg" className={styles.refreshImg} />
            </button>
            <button className={styles.refresh} onClick={add}>
                add
            </button>
            <button className={styles.refresh} onClick={close}>
                erase
            </button>
            <div className={styles.container}>
                {allRoom.length ? (
                    allRoom.map((room, index) => (
                        <div key={index} className={styles.case}>
                            <div className={styles.caseHeader}>
                                <p>{room.roomName}</p>
                            </div>
                            <div className="divider d-flex jc-center"></div>
                            <div className="d-flex jc-sb">
                                <p>{`${room.playerCount} Players`}</p>
                                <button
                                    className={styles.join}
                                    onClick={() => join(room)}
                                >
                                    JOIN
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No room available</p>
                )}
            </div>
        </>
    );
}
