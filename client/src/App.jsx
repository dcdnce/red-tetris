// Le composant racine React
import React, { useState, useEffect } from "react";
import Header from "./components/ui/Header";
import Home from "./components/home/Home";
import Play from "./components/play/Play";
import Register from "./components/home/Register";
import "./styles/global.css";
import styles from "./styles/app/App.module.css";
import { socket } from "./socket";
import { Routes, Route } from "react-router-dom";

function App() {
   return (
      <div className={styles.app}>
         <Header />
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:roomName/:username" element={<Play />} />
            {/* <Register />*/}
         </Routes>
      </div>
   );
}

export default App;
