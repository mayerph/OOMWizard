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
 * route to a certain meme template
 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id
  const meme = await memeController.meme(id)
  res.json(meme)
})

export default router
