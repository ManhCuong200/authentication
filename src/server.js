import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import { swaggerDocs } from "./swagger.js";
import cors from "cors";
dotenv.config();
console.log("ACCESS_SECRET:", process.env.JWT_ACCESS_SECRET);
const app = express();

connectDB();
swaggerDocs(app);
app.use(cors({
    origin: ["http://localhost:5173", "https://fe-authentication-cuong-sama.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(cookieParser()); 

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
