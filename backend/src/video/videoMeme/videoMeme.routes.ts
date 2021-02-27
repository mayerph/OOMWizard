import * as express from "express"
import { Router, Request, NextFunction, Response } from "express"
import { VideoMemeController } from "./videoMeme.controller"
import { IVideoMeme } from "./videoMeme.interface"

const router = express.Router()
const videoMemeController = new VideoMemeController()

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
 * route to all available video memes
 */
router.get("", async (req: Request, res: Response, next: NextFunction) => {
  const memes = await videoMemeController.videoMemes(req.user)
  res.json(memes)
})

/**
 * route to a certain video meme
 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id
  const meme = await videoMemeController.videoMeme(id, req.user)
  res.json(meme)
})

/**
 * route for uploading video meme
 */
router.post("", async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Kommt heir was an")
    console.log(req.body)
    const result = await videoMemeController.addVideoMeme(
      req.body.meme,
      req.user,
      req.body.access
    )
    res.json(result)
  } catch (err) {
    console.log("the err is", err)
    res.status(500)
    res.json(err)
  }
})

export default router
