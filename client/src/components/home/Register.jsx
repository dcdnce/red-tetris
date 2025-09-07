import React, { useEffect } from "react";
import { useState } from "react";
import styles from "../../styles/home/Register.module.css";

function Register() {
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const [input, setInput] = useState("");

    function sendUsername() {
        localStorage.setItem("username", input);
        setUsername(input);
    }

    function disconnect() {
        localStorage.removeItem("username");
        setUsername(null);
    }

    if (username === null) {
        return (
            <>
                <div
                    className={` ${styles.registerBlock} card bg-cyan text-cyan `}
                >
                    <input
                        className={`${styles.registerInput}`}
                        value={input}
                        onChange={(event) => {
                            setInput(event.target.value);
                        }}
                        placeholder="Type your username"
                        type="text"
                    ></input>
                    <button
                        className={` ${styles.registerButton} bg-blue text-blue `}
                        onClick={sendUsername}
                    >
                        Register
                    </button>
                </div>
            </>
        );
    }

    return (
        <div className={` ${styles.registerBlock} card bg-cyan text-cyan `}>
            <p>Registered</p>
            <button
                className={` ${styles.registerButton} bg-blue text-blue `}
                onClick={disconnect}
            >
                Disconnect
            </button>
        </div>
    );
}

export default Register;
