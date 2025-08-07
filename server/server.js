import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import cluster from "cluster";
import os from "os";
import path from "path";
import connectDatabase from "./src/database/connectDatabase.js";
import testRoutes from "./src/routes/test.routes.js";
import { fileURLToPath } from "url";
import errorHandler from "./src/middlewares/errorHandler.middleware.js";
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
import apiRateLimiter from "./src/middlewares/apiRateLimiter.js";

// Get the current file 
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current file
const __dirname = path.dirname(__filename);

// Load Environment variables
dotenv.config();
const port = process.env.PORT || 8080;
const mode = process.env.NODE_ENV || "development";

// Check if the current environment is production
if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;

  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  };

  // Handle worker exit and fork a new worker
  cluster.on("exit", (worker, code, signal) => {
    cluster.fork();
  });
} else {
  // Connect to MongoDB Database
  connectDatabase();

  // Init Express
  const server = express();

  // Set up view engine
  server.set("view engine", "ejs");
  server.set("views", "./src/views");

  // Middleware
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(compression());
  server.use(cors());
  server.use(apiRateLimiter);
  server.use(helmet());

  // API Routes
  server.use("/api/v1", testRoutes);
  server.use("/api/v1/auth", authRoutes);
  server.use("/api/v1/user", userRoutes);
  server.use("/api/v1/role", roleRoutes);
  server.use("/api/v1/maid", maidRoutes);
  server.use("/api/v1/vehicle", vehicleRoutes);
  server.use("/api/v1/flat", flatRoutes);
  server.use("/api/v1/flatOwner", flatOwnerRoutes);
  server.use("/api/v1/securityGuard", securityGuardRoutes);
  server.use("/api/v1/maintenanceStaff", maintenanceStaffRoutes);
  server.use("/api/v1/tenant", tenantRoutes);
  server.use("/api/v1/visitor", visitorRoutes);
  server.use("/api/v1/complaint", complaintRoutes);
  server.use("/api/v1/dashboard", dashboardRoutes);
  server.use("/api/v1/tenantRegistrationPayment", tenantRegistrationPaymentRoutes);
  server.use("/api/v1/maidRegistrationPayment", maidRegistrationPaymentRoutes);

  // Server static files for admin panel
  server.use(express.static(path.join(__dirname, "../admin", "dist")));

  // Catch-all route for admin panel
  server.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"));
  });

  // Global error handling middleware
  server.use(errorHandler);

  // Start the server
  server.listen(port, () => {
    console.log(`✅ Worker ${process.pid} running in ${mode} mode at http://localhost:${port}`);
  });
};
