import React from "react";
import { useState } from "react";
import { socket } from "../../socket";

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
            <div className="modal center-screen">
               <input
                  className="modal-input"
                  value={input}
                  onChange={(event) => {
                     setInput(event.target.value);
                  }}
                  placeholder="Type your username"
                  type="text"
               ></input>
               <button className="rounded-button bg-red" onClick={sendUsername}>
                  Register
               </button>
            </div>
         </>
      );
   }

   return (
      <div className="modal center-screen">
         <p>Registered</p>
         <button className="rounded-button bg-red" onClick={disconnect}>
            Disconnect
         </button>
      </div>
   )
}

export default Register;
