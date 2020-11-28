import * as express from "express";
import { Router, Request, NextFunction, Response } from "express";
import * as cors from "cors";
import * as http from "http";
import * as bodyParser from "body-parser";
import * as fs from "fs";
import { default as userRoutes } from "./user/user.routes";
import * as config from "./config.json";
import * as mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(
  config.database.path,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  () => {
    console.log("connected to database");
  }
);

/**
 * Base-route
 */
app.get("", (req: Request, res: Response, next: NextFunction) => {
  res.send("base-route");
});

/**
 * Route to all users
 */
app.use("/users", userRoutes);

/**
 * Start server on port 3000
 */
app.listen(config.server.port, () => {
  console.log("backend started");
});
