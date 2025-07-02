import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../../socket.js";
import Register from "./Register.jsx";
import styles from "../../styles/home/Home.module.css";

function Home() {
   const [showInput, setShowInput] = useState(false);
   const [roomName, setRoomName] = useState("");
   const [joinButtonText, setJoinButtonText] = useState("Join");
   const [createButtonText, setCreateButtonText] = useState("Create");
   const [classButton, setClassButton] = useState({
      joinButton: "button-press button-press-hover card bg-cyan text-cyan",
      createButton: "button-press button-press-hover card bg-blue text-blue",
   });
   const [onAnimation, setOnAnimation] = useState("None");
   const joinButtonRef = useRef(null);
   const createButtonRef = useRef(null);
   const navigate = useNavigate();

   const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

   async function displayInput(e) {
      e.preventDefault();
      if (showInput === false) {
         setOnAnimation("change-button");
         await sleep(150);
         setShowInput(true);
         setJoinButtonText("");
         setCreateButtonText("Join");
      } else {
         setOnAnimation("change-button");
         await sleep(150);
         setShowInput(false);
         setJoinButtonText("Join");
         setCreateButtonText("Create");
      }
   }

   useEffect(() => {
      const refreshAnimation = () => {
         if (createButtonRef && joinButtonRef) {
            setClassButton({
               joinButton:
                  "button-press button-press-hover card bg-cyan text-cyan",
               createButton:
                  "button-press button-press-hover card bg-blue text-blue",
            });
            setOnAnimation("");
         }
      };

      if (
         joinButtonRef.current &&
         createButtonRef &&
         onAnimation == "change-button"
      ) {
         setClassButton((prev) => ({
            ...prev,
            joinButton: `button-press move-to-right card bg-cyan text-cyan`,
            createButton: ` button-press move-to-left card bg-blue text-blue`,
         }));
         joinButtonRef.current.addEventListener(
            "animationend",
            refreshAnimation
         );
      }

      if (
         joinButtonRef.current &&
         createButtonRef &&
         onAnimation == "change-windows"
      ) {
         setClassButton((prev) => ({
            ...prev,
            joinButton: `button-press move-to-right-forwards card bg-cyan text-cyan`,
            createButton: `button-press move-to-left-forwards card bg-blue text-blue`,
         }));
      }

      return () => {
         if (
            joinButtonRef.current &&
            createButtonRef.current &&
            onAnimation != "change-windows"
         ) {
            joinButtonRef.current.removeEventListener(
               "animationend",
               refreshAnimation
            );
            createButtonRef.current.removeEventListener(
               "animationend",
               refreshAnimation
            );
         }
      };
   }, [onAnimation]);

   async function changeWindows() {}

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

   function createRoom() {}

   return (
      <>
         <button
            id="homeButton1"
            className={`${styles.homeButton1} ${classButton.joinButton}`}
            onClick={(e) => {
               displayInput(e);
            }}
            ref={joinButtonRef}
         >
            <h3 className={`${styles.homeButtonText}`}>{joinButtonText}</h3>
            {!showInput && <h3 className={`${styles.homeButtonIcon}`}>╰⋃╯</h3>}
            {showInput && (
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
            )}
            {showInput && <h3 className={`${styles.homeButtonIcon}`}>✕</h3>}
         </button>
         <button
            id="homeButton2"
            className={`${styles.homeButton2} ${classButton.createButton}`}
            onClick={() => {
               createButtonText === "Create" ? createRoom() : joinRoom();
            }}
            ref={createButtonRef}
         >
            <h3 className={`${styles.homeButtonText}`}>{createButtonText}</h3>
            {!showInput && (
               <h3 className={`${styles.homeButtonIcon}`}>( ㅅ )</h3>
            )}
         </button>
         {/* <Register /> */}
      </>
   );
}

export default Home;
