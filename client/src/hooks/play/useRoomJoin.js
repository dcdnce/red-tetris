// hooks/useRoomJoinijs.
import { useEffect } from "react";
import { socket } from "../../socket";

export function useRoomJoin(roomName, username) {
   useEffect(() => {
      const token = localStorage.getItem(`${username}${roomName}`) || null;

      socket.emit("room_join", { roomName, username, token });

      return () => {
         socket.emit("room_exit");
      };
   }, [roomName, username]);
}
