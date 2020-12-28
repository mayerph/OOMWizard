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

/**
 * route for updating a meme template
 */
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id
  try {
    const meme = await memeController.updateMemeTemplate(id, req.body.meme)
    res.json(meme)
  } catch (err) {
    res.status(500)
    res.json(err)
  }
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
    try {
      const result = await memeController.writeMemeTemplate(req.files?.meme)
      res.json(result)
    } catch (err) {
      res.status(500)
      res.json(err)
    }
  }
)

export default router
