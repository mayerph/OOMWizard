import * as express from "express"
import { Router, Request, NextFunction, Response } from "express"
import { VideoTemplateController } from "./videoTemplate.controller"

const router = express.Router()
const videoTemplateController = new VideoTemplateController()
/**
 * route to all available video templates
 */
router.get("", async (req: Request, res: Response, next: NextFunction) => {
  const templates = await videoTemplateController.gifTemplates()
  res.json(templates)
})

/**
 * route to a certain video template
 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id
  const template = await videoTemplateController.gifTemplate(id)
  res.json(template)
})

/**
 * route for updating a video template
 */
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id
  try {
    const template = await videoTemplateController.updateGifTemplate(
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
 * route for deleting a video template
 */
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    try {
      const result = await videoTemplateController.deleteGifTemplate(id)
      res.json(result)
    } catch (err) {
      res.status(500)
      res.json(err)
    }
  }
)

/**
 * route for uploading video templates
 */
router.post("", async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.files)
  console.log(req.files?.template)
  if (!req.files) {
    res.status(500)
  }
  try {
    const result = await videoTemplateController.writeVideoTemplate(
      req.files?.template
    )
    res.json(result)
  } catch (err) {
    res.status(500)
    res.json(err)
  }
})

export default router
