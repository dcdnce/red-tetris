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
   return (
      <>
         <Header />
         <main>
            <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/:roomName/:username" element={<Play />} />
               <Route path="/about" element={<Home />} />
               {/* <Register />*/}
            </Routes>
         </main>
      </>
   );
}

export default App;
