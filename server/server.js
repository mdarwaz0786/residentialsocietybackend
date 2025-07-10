import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import compression from "compression";
import connectDatabase from "./src/database/connectDatabase.js";
import testRoutes from "./src/routes/test.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import errorHandler from "./src/middlewares/errorHandler.middleware.js";
import userRoutes from "./src/routes/user.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import roleRoutes from "./src/routes/role.routes.js";
import maidRoutes from "./src/routes/maid.routes.js";
import vehicleRoutes from "./src/routes/vehicle.routes.js";
import flatRoutes from "./src/routes/flat.routes.js";

// Path to current file
const __filename = fileURLToPath(import.meta.url);

// Path to current folder
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Connect to mongodb database
connectDatabase();

// Initialize Express app
const server = express();

// Register Middlewares
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(compression());
server.use(cors());

// API Routes
server.use("/api/v1", testRoutes);
server.use("/api/v1/auth", authRoutes);
server.use("/api/v1/user", userRoutes);
server.use("/api/v1/role", roleRoutes);
server.use("/api/v1/maid", maidRoutes);
server.use("/api/v1/vehicle", vehicleRoutes);
server.use("/api/v1/flat", flatRoutes);

// Serve static files from the React admin build folder
server.use(express.static(path.join(__dirname, "../admin", "dist")));

// Serve index.html for the root route
server.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"));
});

// Global error handler middleware
server.use(errorHandler);

// Environment variables
const port = process.env.PORT;
const mode = process.env.NODE_ENV;

// Start server
server.listen(port, () => {
  console.log(`✅ Server is successfully running in ${mode} mode at url http://localhost:${port}`);
});
