// Le composant racine React

import React, { useState, useEffect } from "react";
import Header from "./components/ui/Header";
import Home from "./components/home/Home";
import Register from "./components/home/Register";
import "./styles/global.css";
import { socket } from "./socket";
import ConnectionState from "./components/sockets/ConnectionState";
import ConnectionManager from "./components/sockets/ConnectionManager";

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
         <Register />
         <main>
         </main>
      </>      
   );
}

export default App;
