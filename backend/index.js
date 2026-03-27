import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";

import routes from "./routes/index.js";

dotenv.config();

const app = express();

const DEFAULT_DEV_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:4173",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:4173",
  "http://127.0.0.1:5173",
];

const configuredOrigins = [
  process.env.FRONTEND_URL,
  process.env.ALLOWED_ORIGINS,
]
  .filter(Boolean)
  .flatMap((value) => value.split(","))
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? configuredOrigins
    : [...new Set([...configuredOrigins, ...DEFAULT_DEV_ORIGINS])];

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new Error(
        `CORS blocked for origin: ${origin}. Allowed origins: ${allowedOrigins.join(
          ", "
        )}`
      )
    );
  },
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(cors(corsOptions));
app.use(morgan("dev"));

// db connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("BD Connected successfully."))
  .catch((err) => console.log("Failed to connect to DB:", err));

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Welcome to TaskHub API",
  });
});

app.get("/api-v1/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "taskhub-backend",
    environment: process.env.NODE_ENV || "development",
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

app.use("/api-v1", routes);

// error middleware
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// not found middleware
app.use((req, res) => {
  res.status(404).json({
    message: "Not found",
  });
});

const server = app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} with ${allowedOrigins.length} allowed origin(s).`
  );
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Stop the other process or change PORT in backend/.env.`
    );
    process.exit(1);
  }

  console.error("Failed to start server:", error);
  process.exit(1);
});
