import * as express from "express"
import { Router, Request, NextFunction, Response } from "express"
import { TemplateController } from "./template.controller"

const router = express.Router()
const templateController = new TemplateController()
/**
 * route to all available meme templates
 */
router.get("", async (req: Request, res: Response, next: NextFunction) => {
  const memes = await templateController.templates()
  res.json(memes)
})

/**
 * route to a certain meme template
 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id
  const meme = await templateController.meme(id)
  res.json(meme)
})

/**
 * route for updating a meme template
 */
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id
  try {
    const meme = await templateController.updateMemeTemplate(id, req.body.meme)
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
      const result = await templateController.writeMemeTemplate(req.files?.meme)
      res.json(result)
    } catch (err) {
      res.status(500)
      res.json(err)
    }
  }
)

export default router
