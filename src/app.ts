import express from "express";
import dbConnect from "./config/db";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import adminRoutes from "./routes/adminRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import bannerRoutes from "./routes/bannerRoutes";
import cartRoutes from "./routes/cartRoutes";
import wishlistRoutes from "./routes/wishlistRoutes";
import couponRoutes from "./routes/couponRoutes";
import orderRoutes from "./routes/orderRoutes";
import helmet from "helmet";
import morgan from "morgan"; // For logging HTTP requests
import xssClean from "xss-clean"; // For XSS protection
import rateLimit from "express-rate-limit"; // For limiting repeated requests
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// CORS options
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS.split(","), // Split multiple origins
};

// Middleware
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(xssClean()); // Protect against XSS attacks
app.use(morgan("combined")); // Log HTTP requests

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Routes
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/banner", bannerRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/coupon", couponRoutes);
app.use("/api/v1/order", orderRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Error handler
app.use(errorHandler);

// Graceful shutdown
const server = dbConnect()
  .then(() => {
    const serverInstance = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    // Handle graceful shutdown
    const shutdown = (signal: any) => {
      console.log(`Received ${signal}. Shutting down gracefully...`);
      serverInstance.close((err) => {
        if (err) {
          console.error("Error shutting down server", err);
          process.exit(1);
        }
        console.log("Closed out remaining connections.");
        process.exit(0);
      });
    };

    // Listen for termination signals
    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
    // Here you could log the error and decide what to do next
    // e.g., retry the connection, alert the necessary parties, etc.
  });
