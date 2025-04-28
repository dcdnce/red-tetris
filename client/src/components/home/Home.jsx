import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../../socket.js"
//import styles from "../../styles/home/Home.module.css";

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

function Home(){
    const [showInput, setShowInput] = useState(false);
    const [roomName, setRoomName] = useState("")
    const [joinButtonText, setJoinButtonText] = useState("JOIN");
    const [createButtonText, setCreateButtonText] = useState("CREATE");  
    const [classButton, setClassButton] = useState({
        joinButton: "vintage-button bg-blue",
        createButton: "vintage-button bg-blue",
    });
    const [onAnimation, setOnAnimation] = useState("None");
    const joinButtonRef = useRef(null);
    const createButtonRef = useRef(null);
    const navigate = useNavigate();
    
    const sleep = ms => new Promise(r => setTimeout(r, ms));


    async function displayInput(e){
        e.preventDefault();
        if (showInput === false){
            setOnAnimation("JOIN");
            await sleep(150);
            setShowInput(true);
            setJoinButtonText("");
            setCreateButtonText("JOIN");
        }
        else {
            setOnAnimation("JOIN");
            await sleep(150);
            setShowInput(false);
            setJoinButtonText("JOIN");
            setCreateButtonText("CREATE");
        }
    }

    useEffect(() => {
        const refreshAnimation = () => {
            if (createButtonRef && joinButtonRef){
                setClassButton({joinButton: "vintage-button bg-blue", createButton: "vintage-button bg-blue"});
                setOnAnimation("");
            }
        };

        if (joinButtonRef.current && createButtonRef && onAnimation == "JOIN") {
            setClassButton(prev => ({...prev, joinButton: `${prev.joinButton} changeButtonRight`, createButton: ` ${prev.createButton} changeButtonLeft`}));
            joinButtonRef.current.addEventListener("animationend", refreshAnimation);
        }

        if (joinButtonRef.current && createButtonRef && onAnimation == "SEND") {
            setClassButton(prev => ({...prev, joinButton: `${prev.joinButton} changeWindowsRight`, createButton: ` ${prev.createButton} changeWindowsLeft`}));
        }

        return () => {
            if (joinButtonRef.current && createButtonRef.current && onAnimation != "SEND") {
              joinButtonRef.current.removeEventListener("animationend", refreshAnimation);
              createButtonRef.current.removeEventListener("animationend", refreshAnimation);
            }
          };
    }, [onAnimation]);

    async function changeWindows(){
    }

    async function joinRoom(){
        if (!roomName.trim()) {
            alert("Please enter a room name.");
            return;
        }

        socket.emit('room_join_request', { roomName }, (response) => {
            if (response.success) {
                navigate(`/${roomName}/${socket.id}`);
                console.log(response.message);
            }
            else {
                console.log(response.error);
            }
        });

        // setOnAnimation("SEND");
        // await sleep(499);
        // setClassButton({joinButton: "d-none", createButton:"vintage-button bg-blue change-windows"});
        
    }

    function createRoom(){
    }

    return (
    <>
        <div className="d-flex center-screen">
            <button id="homeButton1" className={classButton.joinButton} onClick={(e) => {displayInput(e)}} ref={joinButtonRef} >
                {joinButtonText}
                {showInput && <input id="homeInputRoom" value={roomName} placeholder="Room Name" onChange={(e) => {setRoomName(e.target.value)}} onClick={(e) => {e.stopPropagation();}} autoFocus type="text" />}
            </button>
            <button id="homeButton2" className={classButton.createButton} onClick={()=> {createButtonText === "CREATE" ? createRoom() : joinRoom()}} ref={createButtonRef}>
                {createButtonText}
            </button>
        </div>
    </>
    );
}

export default Home;