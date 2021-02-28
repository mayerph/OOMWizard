import * as express from "express"
import { Router, Request, NextFunction, Response } from "express"
import { GifTemplateController } from "./gifTemplate.controller"

const router = express.Router()
const gifTemplateController = new GifTemplateController()
/**
 * route to all available gif templates
 */
router.get("", async (req: Request, res: Response, next: NextFunction) => {
  const templates = await gifTemplateController.gifTemplates(req.user)
  res.json(templates)
})

/**
 * route to a certain gif template
 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id
  const template = await gifTemplateController.gifTemplate(id, req.user)
  res.json(template)
})

/**
 * route for updating a gif template
 */
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id
  try {
    const template = await gifTemplateController.updateGifTemplate(
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
 * route for deleting a gif template
 */
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    try {
      const result = await gifTemplateController.deleteGifTemplate(id)
      res.json(result)
    } catch (err) {
      res.status(500)
      res.json(err)
    }
  }
)

/**
 * route for uploading gif templates
 */
router.post("", async (req: Request, res: Response, next: NextFunction) => {
  if (!req.files) {
    res.status(500)
  }
  try {
    const result = await gifTemplateController.writeGifTemplate(
      req.files?.template
    )
    res.json(result)
  } catch (err) {
    res.status(500)
    res.json(err)
  }
})

export default router
