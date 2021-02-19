import * as express from "express"
import { Router, Request, NextFunction, Response } from "express"
import { LikesController } from "./votes.controller"

const router = express.Router()
const likeController = new LikesController()

router.get(
  "/likes",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let meme_id = req.query.meme_id as string
      if(!meme_id){
        return res.status(400).send("query param 'meme_id' is reuqired.").end()
      }
      let likes = await likeController.get_likes(meme_id)
      return res.status(200).json({
        meme_id: meme_id,
        likes: likes,
      }).end()
    } catch (err) {
      return res.status(500).json(err).end()
    }
  }
)

router.post(
  "/likes",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user){
        return res.status(403).send("Please login to use that resource.")
      }
      let meme_id = req.body.mem_id 
      if(!meme_id){
        return res.status(400).send("query param 'meme_id' is reuqired.").end()
      }
      let like = req.body.unlike ? !req.body.unlike : true

      let likes = like
          ? await likeController.like(meme_id, req.user)
          : await likeController.unlike(meme_id,req.user)

      return res.status(200).json({
        meme_id: meme_id,
        likes: likes,
      }).end()
    } catch (err) {
      return res.status(500).json(err).end()
    }
  }
)
