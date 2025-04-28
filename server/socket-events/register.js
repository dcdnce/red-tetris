export default function handleRegister(socket) {
   socket.on("register", (username) => {
      console.log(`Register received from ${socket.id}: ${username}`);
   });
}
