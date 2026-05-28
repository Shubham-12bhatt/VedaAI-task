import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

let io: Server | null = null;

/**
 * Initializes the Socket.io websocket server.
 */
export const initSocketServer = (server: HttpServer): Server => {
  io = new Server(server, {
    cors: {
      origin: "*", // Standard wildcard for dev; can be restricted in config
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`WebSocket client connected: ${socket.id}`);

    // Client join request for specific room
    socket.on("join-assignment", (assignmentId: string) => {
      socket.join(assignmentId);
      console.log(`Socket client ${socket.id} joined room for assignment ${assignmentId}`);
    });

    socket.on("disconnect", () => {
      console.log(`WebSocket client disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Retrieves the active Socket.io server instance.
 */
export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io is not initialized. Please call initSocketServer first.");
  }
  return io;
};

/**
 * Broadcasts status updates for question generation to specific client rooms.
 */
export const emitStatusUpdate = (assignmentId: string, status: string, data?: any) => {
  if (io) {
    io.to(assignmentId).emit("status-update", { assignmentId, status, ...data });
    console.log(`WebSocket broadcast: Status updated for assignment ${assignmentId} to "${status}"`);
  }
};
export default initSocketServer;
