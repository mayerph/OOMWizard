import * as express from "express"
import { Router, Request, NextFunction, Response } from "express"
import { IGifMeme } from "../gif/gifMeme/gifMeme.interface"
import { TemplateController } from "./template.controller"

const router = express.Router()
const templateController = new TemplateController()
/**
 * route to all available meme templates
 */
router.get("", async (req: Request, res: Response, next: NextFunction) => {
  const templates = await templateController.templates(req.user)
  res.json(templates)
})

/**
 * route to a certain meme template
 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id
  const template = await templateController.template(id, req.user)
  res.json(template)
})

/**
 * route for updating a meme template
 */
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id
  try {
    const template = await templateController.updateMemeTemplate(
      id,
      req.body.template
    )
    res.json(template)
  } catch (err) {
    res.status(500)
    res.json(err)
  }
})

/**
 * route for deleting a meme template
 */
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    try {
      const result = await templateController.deleteMemeTemplate(id)
      res.json(result)
    } catch (err) {
      res.status(500)
      res.json(err)
    }
  }
)

/**
 * route for uploading meme templates
 */
router.post("", async (req: Request, res: Response, next: NextFunction) => {
  if (!req.files) {
    res.status(500)
  }
  try {
    const result = await templateController.writeMemeTemplate(
      req.files?.template,
      req.user,
      req.body.access
    )
    res.json(result)
  } catch (err) {
    res.status(500)
    res.json(err)
  }
})

export default router
