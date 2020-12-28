import * as express from "express"
import { Router, Request, NextFunction, Response } from "express"
import { MemeController } from "./meme.controller"

const router = express.Router()
const memeController = new MemeController()
/**
 * route to all available meme templates
 */
router.get("", async (req: Request, res: Response, next: NextFunction) => {
  const memes = await memeController.memes()
  res.json(memes)
})

/**
 * route for uploading meme templates
 */
router.post(
  "/upload",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.files) {
      res.status(500)
    }
    const result = await memeController
      .writeMemeTemplate(req.files?.meme)
      .catch((err) => {
        res.status(500)
      })
    res.send(result)
  }
)

export default router
