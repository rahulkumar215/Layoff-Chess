import app from "./app.js";
import appConfig from "./config/appConfig.js";

const { PORT } = appConfig;

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

process.on("unhandledRejection", (err: any) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err: any) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});
