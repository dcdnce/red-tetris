import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectRoomState } from "../../store/gameSlice";
import { showToast } from "../../components/utils/Toast";
import { kFinishedState } from "../../services/constants";

export function useEndToast(roomName) {
    const roomState = useSelector(selectRoomState(roomName));

    useEffect(() => {
        if (roomState === kFinishedState) {
            showToast("", `Game over.`, "info", {
                duration: 10000,
            });
        }
    }, [roomState]);
}
