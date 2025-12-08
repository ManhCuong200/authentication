import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import connectDB from "./config/db.js";
import { swaggerDocs } from "./swagger.js";
import cors from "cors";

dotenv.config();

const app = express();
app.set("trust proxy", 1);

connectDB();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://fe-authentication-cuong-sama.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

// 🔥 REGISTER ROUTES BEFORE SWAGGER
app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes);

// 🔥 THEN LOAD SWAGGER LAST
swaggerDocs(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
