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
 * route to a add a new meme
 */
router.post("", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const meme = await memeController.addMeme(req.body.memes)
    res.json(meme)
  } catch (err) {
    res.status(500)
    res.json(err)
  }
})

/**
 * route to a add a new meme and return the file
 */
router.post(
  "/file",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // if only one meme is part of the body
      if (
        (req.body.memes && (req.body.memes as any[]).length == 1) ||
        req.body.memes.length == undefined
      ) {
        const { stream, filename } = await memeController.memeFile(
          req.body.memes
        )
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`)
        res.setHeader("Content-type", "image/png")
        stream.pipe(res)
      }
      // if multiple memes are part of the body
      else {
        console.log("kommt hier was an")
        const { zip, filename } = await memeController.zipFile(req.body.memes)
        console.log("4")
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`)
        res.setHeader("Content-type", "application/zip")
        console.log("5")
        zip.pipe(res)
      }
    } catch (err) {
      console.log("ereror", err)
      res.status(500)
      res.json(err)
    }
  }
)

export default router
