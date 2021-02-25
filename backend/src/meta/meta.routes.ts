import * as express from "express"
import { Router, Request, NextFunction, Response } from "express"
import { RatingController } from "./rating.controller"
import { GeneratedMemesController } from "./gen.controller"
import { ViewsController } from "./views.controller"
import { CommentsController } from "../comments/comments.controller"
import { require_form_param, require_query_param, require_user } from "../utils"
import { Rating } from "./rating.model"

const router = express.Router()
const ratingController = new RatingController()
const viewsController = new ViewsController()
const generatedMemesController = new GeneratedMemesController()
const commentsController = new CommentsController()

async function get_meta(identifier?: string) {
  return {
    meta_info: {
      avg_rating: await ratingController.get_avg_rating(identifier),
      nr_ratings: await ratingController.get_nr_ratings(identifier),
      generated_memes: await generatedMemesController.generated_memes(
        identifier
      ),
      views: await viewsController.views(identifier),
      comments: await commentsController.nr_comments(identifier)
    }
  }
}

async function get_user_meta(identifier: string, username?: string) {
  if (username) {
    let rating = await ratingController.get_rating_by_user(identifier, username)
    return {
      user_meta: {
        rating: rating ? rating : "-"
      }
    }
  } else {
    return {}
  }
}

router.get(
  "/stats",
  async (req: Request, res: Response, next: NextFunction) => {
    let identifier = req.query.identifier as string | undefined
    try {
      let stats = {
        identifier: identifier ? identifier : "overall",
        ...(await get_meta(identifier)),
        timeline: {
          generated_memes: await generatedMemesController.generated_memes_timeline(
            identifier
          ),
          views: await viewsController.views_timeline(identifier),
          rating: await ratingController.rating_timeline(identifier),
          nr_comments: await commentsController.nr_comments_timeline(identifier)
        }
      }
      return res.status(200).json(stats).end()
    } catch (err) {
      return res.status(500).json(err).end()
    }
  }
)

async function get_meta_info(identifier: string, username?: string) {
  return {
    identifier: identifier,
    ...(await get_meta(identifier)),
    ...(await get_user_meta(identifier, username))
  }
}

router.get(
  "/:identifier",
  async (req: Request, res: Response, next: NextFunction) => {
    let identifier = req.params.identifier
    let username = req.user
    try {
      let meta_info = await get_meta_info(identifier, username)
      return res.status(200).json(meta_info).end()
    } catch (err) {
      return res.status(500).json(err).end()
    }
  }
)

router.post(
  "/rate",
  require_user(),
  require_form_param("identifier"),
  require_form_param("rating"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let username = req.user as string
      let identifier = req.body.identifier as string
      let rating = req.body.rating as number

      await ratingController.rate(identifier, rating, username)
      let meta_info = await get_meta_info(identifier, username)
      return res.status(200).json(meta_info).end()
    } catch (err) {
      return res.status(500).json(err).end()
    }
  }
)

export default router
