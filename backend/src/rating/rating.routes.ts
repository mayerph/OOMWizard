import * as express from "express"
import { Router, Request, NextFunction, Response } from "express"
import { RatingController } from "./rating.controller"

const router = express.Router()
const ratingController = new RatingController()

const get_rating = async (meme_id: string, username?: string) => {
  let rating = await ratingController.get_rating(meme_id)
  let user_rating = username
    ? await ratingController.get_rating_by_user(meme_id, username)
    : undefined
  return {
    avg_rating: {
      meme_id: meme_id,
      rating: rating.rating,
      nr_ratings: rating.nr_ratings,
    },
    user_rating: username
      ? {
          meme_id: meme_id,
          username: username,
          rating: user_rating? user_rating: 0,
        }
      : undefined 
    }
}

router.get("", async (req: Request, res: Response, next: NextFunction) => {
  try {
    let meme_id = req.query.meme_id as string
    if (!meme_id) {
      return res.status(400).send("query param 'meme_id' is reuqired.").end()
    }
    let json = await get_rating(meme_id, req.user)
    return res.status(200).json(json).end()
  } catch (err) {
    return res.status(500).json(err).end()
  }
})

router.post("", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(403).send("Please login to use that resource.")
    }
    let meme_id = req.body.meme_id
    if (!meme_id) {
      return res.status(400).send("post param 'meme_id' is required.").end()
    }
    let rating = req.body.rating
    if (!rating) {
      return res.status(400).send("post param 'rating' is required.").end()
    }
    await ratingController.rate(meme_id, rating as number, req.user)
    let json = await get_rating(meme_id, req.user)
    return res.status(200).json(json).end()
  } catch (err) {
    return res.status(500).json(err).end()
  }
})

export default router