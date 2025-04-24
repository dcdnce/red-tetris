import React from "react";
import styles from "../../styles/ui/Header.module.css";

function Header() {
   return (
      <header className={styles.header}>
         <div className={styles.container}>
            <div className={styles.container}>
               <div className={styles.logoSpan}></div>
               <h1 className={styles.title}>Tetris</h1>
            </div>
            <nav className={styles.nav}>
               <ul>
                  <li className="ngos-global">Play</li>
                  <li className="ngos-global">About</li>
               </ul>
            </nav>
         </div>
      </header>
   );
}

export default Header;
