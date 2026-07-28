import express from "express";
import cors from "cors";
import feedsArrayRoutes from "./routes/newsRoutes.js";

import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";

const localhost = process.env.LOCALHOST_FRONT;
const remotehost = process.env.REMOTEHOST_FRONT;
const allowedOrigins = [localhost, remotehost].filter(Boolean);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET"],
  }),
);

app.use("/ropie", feedsArrayRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
