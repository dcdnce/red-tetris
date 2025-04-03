import { io } from "socket.io-client";

const URL =
   import.meta.env.MODE === "production"
      ? import.meta.env.VITE_APP_SOCKET_URL // e.g., https://your-deployed-app.com
      : undefined;

export const socket = io(URL, {
   autoConnect: false,
});
