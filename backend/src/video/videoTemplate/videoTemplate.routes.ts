import * as express from "express"
import { Router, Request, NextFunction, Response } from "express"
import { VideoTemplateController } from "./videoTemplate.controller"

const router = express.Router()
const videoTemplateController = new VideoTemplateController()
/**
 * route to all available video templates
 */
router.get("", async (req: Request, res: Response, next: NextFunction) => {
  const templates = await videoTemplateController.gifTemplates(req.user)
  res.json(templates)
})

/**
 * route to a certain video template
 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id
  const template = await videoTemplateController.gifTemplate(id, req.user)
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
      const result = await videoTemplateController.deleteVideoTemplate(id)
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
  if (!req.files) {
    res.status(500)
  }
  try {
    const result = await videoTemplateController.writeVideoTemplate(
      req.files?.template,
      req.user,
      req.body.access
    )
    res.json(result)
  } catch (err) {
    console.log("the error is", err)

    res.status(500)
    res.json(err)
  }
})

export default router
