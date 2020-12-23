import * as express from "express"
import { Router, Request, NextFunction, Response } from "express"
import * as cors from "cors"
import * as http from "http"
import * as bodyParser from "body-parser"
import * as fs from "fs"
import { default as userRoutes } from "./user/user.routes"
import { default as loginRoutes } from "./login/login.routes"
import { default as memesRoutes } from "./meme/meme.routes"
import * as config from "./config.json"
import * as mongoose from "mongoose"
import * as fileUpload from "express-fileupload"

const app = express()
app.use(cors())
app.use(bodyParser.json())
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
 * Route all logins
 */
app.use("/login", loginRoutes)

/**
 * Route to all memes
 */
app.use("/memes", memesRoutes)

/**
 * Start server on port 3000
 */
app.listen(config.server.port, () => {
  console.log(`backend started with port ${config.server.port}`)
})
