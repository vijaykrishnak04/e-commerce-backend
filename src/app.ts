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

import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: [
    "http://192.168.29.116:5173", // Add your allowed URL here
    "http://localhost:5173",
    "https://bq4r49z7-5173.inc1.devtunnels.ms",
    "https://eastbrand.netlify.app"
  ],
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());

//routes
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/banner", bannerRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/coupon", couponRoutes);
app.use("/api/v1/order", orderRoutes);

app.use("*", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});

app.use(errorHandler);

dbConnect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err: any) => {
    console.error("Failed to connect to the database", err);
    // Here you could log the error and decide what to do next
    // e.g., retry the connection, alert the necessary parties, etc.
  });
