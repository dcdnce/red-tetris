// Le composant racine React
import React, { useState, useEffect } from "react";
import Header from "./components/ui/Header";
import Home from "./components/home/Home";
import Play from "./components/play/Play";
import Register from "./components/home/Register";
import "./styles/global.css";
import { socket } from "./socket";
import { Routes, Route } from "react-router-dom";

function App() {
   // State -> component will refresh every time socket.connected changes
   const [isConnected, setIsConnected] = useState(socket.connected);

   useEffect(() => {
      function onConnect() {
         setIsConnected(true);
      }

      function onDisconnect() {
         setIsConnected(false);
      }

      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);

      // Executed on exit
      return () => {
         socket.off("connect", onConnect);
         socket.off("disconnect", onDisconnect);
      };
   }, []);

   return (
      <>
         <Header />
         <main>
            <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/play" element={<Play />} />
               <Route path="/about" element={<Home />} />
               {/* <Register />*/}
            </Routes>
         </main>
      </>      
   );
}

export default App;
