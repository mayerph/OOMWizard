import * as express from "express"
import { Router, Request, NextFunction, Response } from "express"
import { MemeController } from "./meme.controller"

const router = express.Router()
const memeController = new MemeController(true)
/**
 * route to all available meme
 */
router.get("", async (req: Request, res: Response, next: NextFunction) => {
  const memes = await memeController.memes(req.user)
  res.json(memes)
})
/**
 * route to query memes and get them as zip
 */
router.get(
  "/files.zip",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      var limit = req.query.limit ? parseInt(req.query.limit as string) : 10
      var query = req.query.query as string
      const memes = await memeController.query_memes(query, limit, req.user)
      memes.forEach((e) =>
        console.log(
          `Meme query result ${e.name} with ${e.owner} and ${e.access}`
        )
      )
      const { zip, filename } = await memeController.zipFile(memes)
      res.attachment(`${filename}`)
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`)
      res.setHeader("Content-type", "application/zip")
      zip.pipe(res)
    } catch (err) {
      res.status(500)
      res.json(err)
    }
  }
)

/**
 * route to a certain meme
 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id
  const meme = await memeController.meme(id, req.user, true)
  res.json(meme)
})

/**
 * route for deleting a meme
 */
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    try {
      const meme = await memeController.deleteMeme(id, req.user)
      res.json(meme)
    } catch (err) {
      res.status(500)
      res.json(err)
    }
  }
)

/**
 * route to a add a new meme
 */
router.post("", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const meme = await memeController.addMeme(
      req.body.memes,
      req.user,
      req.body.access
    )
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
          [].concat(req.body.memes)[0]
        )
        res.attachment(`${filename}`)
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`)
        res.setHeader("Content-type", "image/png")
        res.setHeader("Filename", filename)
        stream.pipe(res)
      }
      // if multiple memes are part of the body
      else {
        const { zip, filename } = await memeController.zipFile(req.body.memes)
        res.attachment(`${filename}`)
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`)
        res.setHeader("Content-type", "application/zip")

        zip.pipe(res)
      }
    } catch (err) {
      res.status(500)
      res.json(err)
    }
  }
)
export default router
