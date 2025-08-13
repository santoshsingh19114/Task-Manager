import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import dbConnection from "./utils/index.js";
import routes from "./routes/index.js";
import { errorHandler, routeNotFound } from "./middlewares/errorMiddleware.js";

dotenv.config();

const app = express();

// Connect to DB
dbConnection();

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000", // Local frontend
  "https://task-manager-8r4f-oyhlpj7bk-santosh-kumars-projects.vercel.app", // Replace with your actual Vercel link
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allows cookies & auth headers
    methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => res.send("API is working"));
app.use("/api", routes);

// Error handling
app.use(routeNotFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
