export default function handlePing(socket) {
   socket.on("ping", (callback) => {
      console.log(`Received ping from ${socket.id}`);
      if (typeof callback === "function") {
         callback("pong");
      }
   });
}
