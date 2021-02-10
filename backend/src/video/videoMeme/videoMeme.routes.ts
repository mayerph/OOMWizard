import * as express from "express"
import { Router, Request, NextFunction, Response } from "express"
import { VideoMemeController } from "./videoMeme.controller"
import { IVideoMeme } from "./videoMeme.interface"

const router = express.Router()
const videoTemplateController = new VideoMemeController()

router.post(
  "/gencaption",
  async (req: Request, res: Response, next: NextFunction) => {
    const meme: IVideoMeme = req.body.meme
    meme.frames?.frames.map((e) => {
      e["captions"] = [
        {
          text: "hello world",
          position: {
            x: 0,
            y: 0
          },
          color: "green",
          size: 60
        }
      ]
      return e
    })
    res.json(meme)
  }
)
/**
 * route to all available video templates
 */
router.get("", async (req: Request, res: Response, next: NextFunction) => {
  const templates = await videoTemplateController.videoMemes()
  res.json(templates)
})

/**
 * route to a certain video template
 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id
  const template = await videoTemplateController.videoMeme(id)
  res.json(template)
})

/**
 * route for uploading video templates
 */
router.post("", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await videoTemplateController.addVideoMeme(req.body.meme)
    res.json(result)
  } catch (err) {
    res.status(500)
    res.json(err)
  }
})

export default router
