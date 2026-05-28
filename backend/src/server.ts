import express, { Request, Response, NextFunction } from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { initSocketServer } from "./socket/socketServer";
import assignmentRoutes from "./routes/assignmentRoutes";
import "./queues/assignmentWorker";

dotenv.config();

const PORT = parseInt(process.env.PORT || "5000", 10);

const startServer = async () => {
  const app = express();
  const server = http.createServer(app);

  // 1. Establish Database Connection
  await connectDB();

  // 2. Enable WebSockets
  initSocketServer(server);

  // 3. Mount Middlewares
  app.use(cors({
    origin: "*", // Adjust origins in production
    credentials: true,
  }));
  app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // 4. Mount API Routes
  app.use("/api/assignments", assignmentRoutes);

  // Health check route
  app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "OK", timestamp: new Date() });
  });

  // 5. Global Error Handling Middleware
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Express global error handler:", err.stack || err);
    
    const statusCode = err.status || 500;
    res.status(statusCode).json({
      error: err.message || "Internal Server Error",
    });
  });

  // 6. Listen on Port
  server.listen(PORT, () => {
    console.log(`VedaAI Express Server running on HTTP port ${PORT}`);
  });
};

// Start bootstrapping the backend application
startServer().catch((error) => {
  console.error("Critical: Failed to start express server", error);
  process.exit(1);
});
