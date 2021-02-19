import * as express from "express"
import { Router, Request, NextFunction, Response } from "express"
import { CommentsController } from "./comments.controller"

const router = express.Router()
const commentsController = new CommentsController()

router.get(
  "",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let meme = req.query.meme_id as string
      if (!meme) {
        return res.status(400).send("query param 'meme_id' is required.").end()
      }
      let comments = await commentsController.list_comments(meme)
      return res.json(comments).end()
    } catch (err) {
      return res.status(500).json(err).end()
    }
  }
)

router.post(
  "/post",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(403).send("Log in to submit a comment.").end()
    }
    try {
      await commentsController.comment(
        req.body.meme_id as string,
        req.user,
        req.body.comment as string
      )
      let comments = await commentsController.list_comments(
        req.body.meme_id as string
      )
      return res.json(comments).end()
    } catch (err) {
      return res.status(500).json(err).end()
    }
  }
)

export default router
