import * as express from "express"
import { Router, Request, NextFunction, Response } from "express"
import { default as gifTemplateRouter } from "./gifTemplate/gifTemplate.routes"
import { default as gifMemeRouter } from "./gifMeme/gifMeme.routes"

const router = express.Router()
const templateChildRoute = "/templates"
const memeChildRoute = "/memes"
/**
 * returns all routes of a router
 * @param router the router which contains all routes
 */
const availableRoutes = (router: Router, childRoute: string) => {
  return router.stack
    .filter((r) => r.route)
    .map((r) => {
      return {
        method: Object.keys(r.route.methods)[0].toUpperCase(),
        path: `${childRoute}${r.route.path}`
      }
    })
}

/**
 * send possible options for gifs
 */
router.get("", (req: Request, res: Response, next: NextFunction) => {
  res.send({
    templates: availableRoutes(gifTemplateRouter, templateChildRoute),
    memes: availableRoutes(gifMemeRouter, memeChildRoute)
  })
})

/**
 * include the gif template routes
 */
router.use(templateChildRoute, gifTemplateRouter)

/**
 * include the gif memes routes
 */
router.use(memeChildRoute, gifMemeRouter)

export default router
