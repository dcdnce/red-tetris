import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/ui/Header.module.css";

function Header() {
   return (
      <header className={`${styles.header} card bg-red text-red`}>
         <Link to="/">
            <div className={styles.container}>
               <div className={styles.logoSpan}></div>
               <h1>Tetris</h1>
            </div>
         </Link>
      </header>
   );
}

export default Header;
