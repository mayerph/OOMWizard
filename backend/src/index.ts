import * as express from "express"
import { Router, Request, NextFunction, Response } from "express"
import * as cors from "cors"
import * as http from "http"
import * as bodyParser from "body-parser"
import * as fs from "fs"
import { default as userRoutes } from "./user/user.routes"
import { default as loginRoutes } from "./login/login.routes"
import { default as memesRoutes } from "./meme/meme.routes"
import { default as templateRoutes } from "./template/template.routes"
import { default as gifRoutes } from "./gif"
import * as config from "./config.json"
import * as mongoose from "mongoose"
import * as fileUpload from "express-fileupload"

var cookieParser = require("cookie-parser")
const app = express()
app.use(cors({ exposedHeaders: ["Filename"] }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.static("storage"))
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }
  })
)

mongoose.connect(
  config.database.path,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  () => {
    console.log("connected to database")
  }
)

/**
 * Base-route
 */
app.get("", (req: Request, res: Response, next: NextFunction) => {
  res.send("base-route")
})

/**
 * Route to all users
 */
app.use("/users", userRoutes)

/**
 * Route all authentication routes
 */
app.use("/auth", loginRoutes)

/**
 * Route to all templates
 */
app.use("/templates", templateRoutes)

/**
 * Route to all memes
 */
app.use("/memes", memesRoutes)

/**
 * Route to the gif routes
 */
app.use("/gif", gifRoutes)

/**
 * Start server on port 3000
 */
app.listen(config.server.port, () => {
  console.log(`backend started with port ${config.server.port}`)
})
