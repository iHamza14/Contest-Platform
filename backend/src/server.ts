import http from "http";
import app from "./app";
import { Server } from "socket.io";
import setupSocket from "./socket";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
});

app.set("io", io);

setupSocket(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});