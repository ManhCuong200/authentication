import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import { swaggerDocs } from "./swagger.js";

dotenv.config();

const app = express();

connectDB();
swaggerDocs(app);

app.use(express.json());
app.use(cookieParser()); 

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
