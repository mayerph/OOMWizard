import * as express from "express"
import { Router, Request, NextFunction, Response } from "express"
import { GifMemeController } from "./gifMeme.controller"
import { IGifMeme } from "./gifMeme.interface"

const router = express.Router()
const gifMemeController = new GifMemeController()

/**
 * helper route to generate a caption
 * only for testing
 */
router.post(
  "/gencaption",
  async (req: Request, res: Response, next: NextFunction) => {
    const meme: IGifMeme = req.body.meme
    meme.frames?.map((e) => {
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
 * route to a add a new gif meme
 */
router.post("", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const meme = await gifMemeController.addGifMeme(req.body.meme)
    res.json(meme)
  } catch (err) {
    res.status(500)
    res.json(err)
  }
})

/**
 * route to all available gif meme
 */
router.get("", async (req: Request, res: Response, next: NextFunction) => {
  const gifMeme = await gifMemeController.gifMemes()
  res.json(gifMeme)
})

/**
 * route to a certain gif meme
 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id
  const gifMeme = await gifMemeController.gifMeme(id)
  res.json(gifMeme)
})
export default router
