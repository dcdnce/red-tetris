import React from "react";
import styles from './Header.module.css';

function Header() {
	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<div className="ngos-global">
					<span>LOGO</span>
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