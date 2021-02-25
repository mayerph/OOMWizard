import * as express from "express"
import { Router, Request, NextFunction, Response } from "express"
import { util } from "prettier"
import { CommentsController } from "./comments.controller"
import { require_query_param,require_form_param, require_user } from "../utils"

const router = express.Router()
const commentsController = new CommentsController()

router.get(
  "/",
  require_query_param("meme_id"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let meme = req.query.meme_id as string
      let comments = await commentsController.list_comments(meme)
      return res
        .json({
          meme_id: meme,
          comments: comments
        })
        .end()
    } catch (err) {
      return res.status(500).json(err).end()
    }
  }
)

router.post(
  "/",
  require_user(),
  require_form_param("meme_id"),
  require_form_param("comment"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await commentsController.comment(
        req.body.meme_id as string,
        req.user as string,
        req.body.comment as string
      )
      let comments = await commentsController.list_comments(
        req.body.meme_id as string
      )
      return res
        .json({
          meme_id: req.body.meme_id,
          comments: comments
        })
        .end()
    } catch (err) {
      console.log(err)
      return res.status(500).json(err).end()
    }
  }
)

export default router
