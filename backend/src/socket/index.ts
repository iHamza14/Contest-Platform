import jwt, { JwtPayload } from "jsonwebtoken";
import { Server, Socket } from "socket.io";

interface UserPayload extends JwtPayload {
  id: string;
  email: string;
}

export default function setupSocket(io: Server) {

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) return next(new Error("Authentication error"));

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;

      socket.data.user = user;

      next();
    } catch {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const user = socket.data.user as UserPayload;

    console.log("User connected:", user.email);

    socket.on("joinContest", (contestId: string) => {
      socket.join(`contest-${contestId}`);
      console.log(`User ${user.email} joined contest ${contestId}`);
    });

    socket.on("leaveContest", (contestId: string) => {
      socket.leave(`contest-${contestId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", user.email);
    });
  });

}