import * as express from "express"
import { Router, Request, NextFunction, Response } from "express"
import { MemeController } from "./meme.controller"

const router = express.Router()
const memeController = new MemeController()

router.get("", async (req: Request, res: Response, next: NextFunction) => {
  const memes = await memeController.memes()
  res.json(memes)
})

// upload image
router.post(
  "/upload",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.files) {
      res.status(500)
    }
    const result = await memeController.writeMemeTemplate(req.files?.meme)
    res.send(result)
  }
)

export default router
