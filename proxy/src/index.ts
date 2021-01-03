import * as express from "express"
import { Router, Request, NextFunction, Response } from "express"
import * as cors from "cors"
import * as bodyParser from "body-parser"
import * as config from "./config.json"
import * as request from "request"
import { ssr } from "./ssr"

var cookieParser = require("cookie-parser")

const app = express()
const destination = `${config.proxy.protocol}://${config.proxy.server}:${config.proxy.port}`
app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.static("public"))

/**
 * route to the page which should be server-side rendered using pupperty.
 * it enables the possibility to dynamically change the meta information of the page.
 * simultaneously the page can be found be search engines and the Open Graph-Markup for previews work
 */
app.get(
  "/meme/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    // console.log("meme | url |", req.url)
    const url = `${destination}${req.url}`
    const { html } = await ssr(url)
    console.log("-------------------->html", html)
    return res.status(200).send(html)
  }
)

/**
 * Proxy-route to the frontend
 */
app.get("*", (req: Request, res: Response, next: NextFunction) => {
  console.log("* | url |", req.url)
  req
    .pipe(request({ qs: req.query, uri: `${destination}${req.url}` }))
    .pipe(res)
})

/**
 * Start server on port 5000
 */
app.listen(config.server.port, () => {
  console.log(`backend started with port ${config.server.port}`)
})
