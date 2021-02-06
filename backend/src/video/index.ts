import * as express from "express"
import { Router, Request, NextFunction, Response } from "express"
import { default as videoTemplateRouter } from "./videoTemplate/videoTemplate.routes"

const router = express.Router()
const templateChildRoute = "/templates"
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
 * send possible options for videos
 */
router.get("", (req: Request, res: Response, next: NextFunction) => {
  res.send({
    templates: availableRoutes(videoTemplateRouter, templateChildRoute)
  })
})

/**
 * include the video template routes
 */
router.use(templateChildRoute, videoTemplateRouter)

export default router
