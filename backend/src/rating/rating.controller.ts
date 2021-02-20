import { exec } from "child_process"
import { User } from "../user/user.model"
import { IRating, Rating } from "./rating.model"

export class RatingController {

  async get_rating(meme_id: string): Promise<number | undefined> {
    let ratings = await Rating.find({ meme_id: meme_id }).exec()
    return ratings.length == 0
      ? undefined
      : ratings.map((a) => a.rating).reduce((a, b) => a + b, 0) / ratings.length
  }

  async get_rating_by_user(
    meme_id: string,
    username: string
  ): Promise<number | undefined> {
    let rating = await Rating.findOne({
      meme_id: meme_id,
      username: username
    }).exec()
    return rating ? rating.rating : undefined
  }

  async rate(meme_id: string, rating: number, username: string) {
    rating = Math.min(Math.max(0, rating), 10)
    await Rating.replaceOne(
      { meme_id: meme_id, username: username },
      new Rating({ meme_id: meme_id, username: username, rating: rating })
    ).exec()
  }
}
