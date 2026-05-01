import { socket } from "../socket.js";
import { useEffect } from "react";

export function useGetBestScore(onSuccess) {
    useEffect(() => {
        socket.emit("get_best_score", {}, (response) => {
            if (response.success) {
				onSuccess(response.scores);
            } else {
				console.log(`Error fetching scores: ${response.error}`)
            }
        });
    }, []);
}