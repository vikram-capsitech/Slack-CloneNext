import { Server as NetServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as ServerIO } from "socket.io";

// Define a custom response type to include the `io` property
export type NextApiResponseServerIo = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: ServerIO;
    };
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    console.log("Setting up Socket.IO server...");
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path,
      cors: {
        origin: "*", // Allow all origins
        methods: ["GET", "POST"],
      },
      addTrailingSlash: false,
    });

    // Handle connection event
    io.on("connection", (socket) => {
      console.log(`New client connected: ${socket.id}`);

      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
      });

      // Add custom event handlers here
      socket.on("chat message", (msg) => {
        console.log("message: " + msg);
        io.emit("chat message", msg);
      });
    });

    // Attach the io instance to the server
    res.socket.server.io = io;
  } else {
    console.log("Socket.IO server already set up");
  }

  res.end();
};

export default ioHandler;
