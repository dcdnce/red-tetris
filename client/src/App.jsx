// Le composant racine React (placeholder).
import React from "react";
import Header from "./components/Header";
import './styles/global.css';

function App() {
   return (
      <>
      <Header />
      <main>
         <h1>Red Tetris (Client)</h1>
      </main>
      </>
   );
}

export default App;
