import { useEffect, useRef } from "react";
import { showToast } from "../../components/utils/Toast";

export function useOpponentConnectionToast(opponents = []) {
    const prevConnectionsRef = useRef(new Map());

    useEffect(() => {
        // Set to false if disconnection (in lobby only?)
        prevConnectionsRef.current.forEach((isConnected, username) => {
            const stillPresent = opponents.some(
                (opponent) => opponent.username === username
            );

            if (!stillPresent) {
                prevConnectionsRef.current.set(username, false);
                showToast("", `${username} is disconnected 🔴`, "info", {
                    duration: 3000,
                });

                prevConnectionsRef.current.delete(username);
            }
        });

        // Trigger toasts
        opponents.forEach((opponent) => {
            const prev = prevConnectionsRef.current.get(opponent.username);

            if (prev !== opponent.isConnected) {
                if (opponent.isConnected) {
                    showToast(
                        "",
                        `${opponent.username} is connected 🟢`,
                        "info",
                        { duration: 3000 }
                    );
                }
                prevConnectionsRef.current.set(
                    opponent.username,
                    opponent.isConnected
                );
            }
        });
    }, [opponents]);
}
