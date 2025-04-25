import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/ui/Header.module.css";

function Header() {
   return (
      <header className={styles.header}>
         <div className={styles.container}>
               <Link to="/">
                  <div className={styles.container}>
                     <div className={styles.logoSpan}></div>
                     <h1 className={styles.title}>Tetris</h1>
                  </div>
               </Link>
            <nav className={styles.nav}>
               <ul>
                  <li className="ngos-global">
                     <Link to="/play">Play</Link>
                  </li>
                  <li className="ngos-global">
                     <Link to="/">About</Link>
                  </li>
               </ul>
            </nav>
         </div>
      </header>
   );
}

export default Header;
