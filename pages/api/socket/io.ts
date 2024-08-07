import { Server as NetServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';

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

const ioHandler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = '/api/socket/io';
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path,
      cors: {
        // Adjust origin for production
        origin: '*',
        methods: ['GET', 'POST'],
      },
      addTrailingSlash: false,
    });

    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });

      socket.on('chat message', (msg) => {
        console.log('message:', msg);
        // Broadcast to all clients except the sender
        socket.broadcast.emit('chat message', msg);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
};

export default ioHandler;
