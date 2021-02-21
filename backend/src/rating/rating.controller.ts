import { exec } from "child_process"
import { User } from "../user/user.model"
import { IRating, Rating } from "./rating.model"

export class RatingController {

  constructor(){
    Rating.deleteMany({}).exec()
  }

  async get_rating(
    meme_id: string
  ): Promise<{ rating: number; nr_ratings: number }> {
    let ratings = await Rating.find({ meme_id: meme_id }).exec()
    return ratings.length == 0
      ? { rating: 0, nr_ratings: 0 }
      : {
          rating:
            ratings.map((a) => a.rating).reduce((a, b) => a + b, 0) /
            ratings.length,
          nr_ratings: ratings.length
        }
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
    console.log((await Rating.find({meme_id:meme_id}).exec()).length)
    //await Rating.find({meme_id: meme_id, username: username}).update({rating:rating}, {upsert:true}).exec()
    await Rating.updateOne({meme_id: meme_id, username: username}, {rating: rating}, {upsert: true}).exec()
    //await Rating.findOneAndUpdate({meme_id: meme_id, username: username}, {rating: rating}, {upsert:true}).exec()
    console.log((await Rating.find({meme_id:meme_id}).exec()).length)
  }
}
