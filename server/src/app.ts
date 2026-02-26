import express from "express";
import type { Application, Request, Response, NextFunction } from "express";
import routes from "./routes/index.js";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import { COOKIE_MAX_AGE } from "./consts.js";
import appConfig from "./config/appConfig.js";

const { COOKIE_SECRET, ALLOWED_HOSTS, PORT, NODE_ENV } = appConfig;

const app: Application = express();

app.use(helmet());

const allowedHosts = ALLOWED_HOSTS.split(",") || [];

app.use(
  cors({
    origin: allowedHosts,
    credentials: true,
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

if (NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// const apiLimiter = rateLimit({
//   max: 100, // max 100 requests
//   windowMs: 60 * 60 * 1000, // 1 hour
//   message: { error: "Too many requests from this IP, please try again later." },
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use("/api", apiLimiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(
  session({
    secret: COOKIE_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: COOKIE_MAX_AGE },
  }),
);

app.use((req: Request, res: Response, next: NextFunction) => {
  const sanitize = (mongoSanitize as any).sanitize;

  if (typeof sanitize === "function") {
    if (req.body) {
      req.body = sanitize(req.body);
    }
    if (req.params) {
      req.params = sanitize(req.params);
    }
    if (req.headers) {
      req.headers = sanitize(req.headers);
    }
    // Intentionally skip req.query to avoid Express 5 getter-only property issues
  }

  next();
});

// app.use(
//   hpp({
//     whitelist: [
//       "sort",
//       "page",
//       "limit",
//       "fields",
//       "leadStatus",
//       "priority",
//       "search",
//       "status",
//       "assignedTo",
//       "assignedBy",
//     ],
//   }),
// );

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// initPassport();

app.use("/api", routes);

app.use((req: Request, res: Response, next: NextFunction) => {
  console.error(`Can't find ${req.originalUrl} on this server!`, 404);
  next();
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // In development → show full error
  if (NODE_ENV === "development") {
    console.error("ERROR 💥", err);

    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // In production → send clean message
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Unknown error → don't leak details
  console.error("ERROR 💥", err);
  return res.status(500).json({
    status: "error",
    message: "Something went very wrong!",
  });
});

export default app;
