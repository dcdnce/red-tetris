import React from "react";
import { useState } from "react";
import { socket } from "../../socket";

function Register() {
   const [username, setUsername] = useState("");

   function sendUsername() {
      socket.emit("register", username);
      localStorage.setItem("username", username);
   }

   return (
      <>
         <div className="modal center-screen">
            <input
               className="modal-input"
               value={username}
               onChange={(event) => {
                  setUsername(event.target.value);
               }}
               placeholder="Type your username"
               type="text"
            ></input>
            <button className="rounded-button bg-blue" onClick={sendUsername}>
               Register
            </button>
         </div>
      </>
   );
}

export default Register;
