import "dotenv/config";
import app from "./app.js";
import { connectDB, disconnectDB } from "./config/db.js";
import "./cron/fetchAndClusterCron.js";

const PORT = process.env.PORT || 3003;

let server;

const startServer = async () => {
  await connectDB();

  server = app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });
};

const shutdown = async (signal) => {
  console.log(`${signal} received - shutting down server.`);

  if (server) {
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
    return;
  }

  await disconnectDB();
  process.exit(0);
};

process.on("unhandledRejection", (err) => {
  console.error(`Unhandled rejection: ${err.message}`);
  shutdown("unhandledRejection");
});

process.on("uncaughtException", (err) => {
  console.error(`Unhandled exception: ${err.message}`);
  shutdown("uncaughtException");
});

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

startServer().catch(async (err) => {
  console.error(`Failed to start server: ${err.message}`);
  await disconnectDB();
  process.exit(1);
});
