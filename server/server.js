import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import compression from "compression";
import path from "path";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { fileURLToPath } from "url";

import connectDatabase from "./src/database/connectDatabase.js";
import errorHandler from "./src/middlewares/errorHandler.middleware.js";
import apiRateLimiter from "./src/middlewares/apiRateLimiter.js";

import testRoutes from "./src/routes/test.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import roleRoutes from "./src/routes/role.routes.js";
import maidRoutes from "./src/routes/maid.routes.js";
import vehicleRoutes from "./src/routes/vehicle.routes.js";
import flatRoutes from "./src/routes/flat.routes.js";
import flatOwnerRoutes from "./src/routes/flatOwner.routes.js";
import securityGuardRoutes from "./src/routes/securityGuard.routes.js";
import maintenanceStaffRoutes from "./src/routes/maintenanceStaff.routes.js";
import tenantRoutes from "./src/routes/tenant.routes.js";
import visitorRoutes from "./src/routes/visitor.routes.js";
import complaintRoutes from "./src/routes/complaint.routes.js";
import tenantRegistrationPaymentRoutes from "./src/routes/tenantRegistrationPayment.routes.js";
import maidRegistrationPaymentRoutes from "./src/routes/maidRegistrationPayment.route.js";
import dashboardRoutes from "./src/routes/dashboard.routes.js";
import chatRoutes from "./src/routes/chat.routes.js";
import chatSocketHandler from "./src/socket/chat.socket.js";

// Get the current file 
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current file
const __dirname = path.dirname(__filename);

// Load Environment variables
dotenv.config();
const port = process.env.PORT || 8080;
const mode = process.env.NODE_ENV || "development";

// Connect to MongoDB Database
connectDatabase();

// Init Express
const app = express();

// Create HTTP server (needed for socket.io)
const httpServer = createServer(app);

// Initialize Socket.io
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Call chat socket handler
chatSocketHandler(io);

// Set up view engine
app.set("view engine", "ejs");
app.set("views", "./src/views");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cors());
app.use(apiRateLimiter);

// API Routes
app.use("/api/v1", testRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/role", roleRoutes);
app.use("/api/v1/maid", maidRoutes);
app.use("/api/v1/vehicle", vehicleRoutes);
app.use("/api/v1/flat", flatRoutes);
app.use("/api/v1/flatOwner", flatOwnerRoutes);
app.use("/api/v1/securityGuard", securityGuardRoutes);
app.use("/api/v1/maintenanceStaff", maintenanceStaffRoutes);
app.use("/api/v1/tenant", tenantRoutes);
app.use("/api/v1/visitor", visitorRoutes);
app.use("/api/v1/complaint", complaintRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/tenantRegistrationPayment", tenantRegistrationPaymentRoutes);
app.use("/api/v1/maidRegistrationPayment", maidRegistrationPaymentRoutes);

// Server static files for admin panel
app.use(express.static(path.join(__dirname, "../admin", "dist")));

// Catch-all route for admin panel
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"));
});

// Global error handling middleware
app.use(errorHandler);

// Start the server
httpServer.listen(port, () => console.log(`✅ Server is running in ${mode} mode at http://localhost:${port}`));
