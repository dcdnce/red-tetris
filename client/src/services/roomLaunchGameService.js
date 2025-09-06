import { socket } from "../socket";

export default function useRoomLaunchGame(roomName, username) {
   const token = localStorage.getItem(`${username}${roomName}`) || null;

   socket.emit("room_launch", { roomName, username, token });

   console.log("room_launch emitted");
}
