import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectWinnerUsername } from "../../store/gameSlice";
import { showToast } from "../../components/utils/Toast";

export function useWinnerToast(roomName) {
    const winnerUsername = useSelector(selectWinnerUsername(roomName));

    useEffect(() => {
        if (winnerUsername) {
            showToast("", `${winnerUsername} won.`, "success", {
                duration: 10000,
            });
        }
    }, [winnerUsername]);
}
