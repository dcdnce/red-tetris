import { io } from "socket.io-client";

// const URL =
//    import.meta.env.VITE_MODE === "production"
//       ? import.meta.env.VITE_APP_SOCKET_URL // e.g., https://your-deployed-app.com
//       : undefined;

export const socket = io(undefined, {
   autoConnect: true,
});
