import { Server as HttpServer } from "http";
import { Socket, Server as SocketIOServer } from "socket.io";


let io: SocketIOServer;

export const initSocketIO = async (server: HttpServer): Promise<void> => {
  console.log("Initializing Socket.IO server...");
  const { Server } = await import("socket.io");
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

  console.log("Socket.IO server initialized!");
  io.on("connection", (socket: Socket) => {
    console.log("Socket just connected:", socket.id);

    // Listen for messages from the client
    socket.on("clientMessage", (message: string) => {
      console.log("Message received from client:", message);

      // Optionally, send a response back to the client
      socket.emit("serverMessage", `Server received: ${message}`);
    });
    socket.on("disconnect", () => {
      console.log(socket.id, "just disconnected");
    });
  });
};




