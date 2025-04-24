import React from "react";
import { useState } from "react";
import styles from "../../styles/home/Register.module.css";
import { socket } from "../../socket";

function Register (){
    const [username, setUsername] = useState('') 

    function sendUsername(){
        socket.emit("register", username);
        localStorage.setItem("username", username);
    }

    return (
        <>
            <div className={styles.modal}>
                <input className={styles.modalInput} value={username} onChange={(event) => {setUsername(event.target.value);}} placeholder="Type your username" type="text"></input>
                <button className={styles.modalButton} onClick={sendUsername}>
                    Register
                </button>
            </div>
        </>
    );
}

export default Register;