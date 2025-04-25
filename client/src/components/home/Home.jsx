import React from "react";
// import socket from "../../socket";
//import styles from "../../styles/home/Home.module.css";

function Home(){
    function joinRoom(){
        // socket.emit("joinRoom");
    }

    function createRoom(){
        
    }

    return (
    <>
        <div className="d-flex center-screen">
            <button className="vintage-button bg-blue" onClick={joinRoom}>
                JOIN
            </button>
            {/* <button className="vintage-button bg-blue" onClick={createRoom}>
                CREATE
            </button> */}
        </div>
    </>
    );
}

export default Home;