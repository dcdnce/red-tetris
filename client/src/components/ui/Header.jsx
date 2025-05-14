import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/ui/Header.module.css";

function Header() {
   return (
      <header className={`${styles.header} card`}>
         <Link to="/">
            <div className={styles.container}>
               <div className={styles.logoSpan}></div>
               <h1 className={styles.title}>Tetris</h1>
            </div>
         </Link>
      </header>
   );
}

export default Header;
