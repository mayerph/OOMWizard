import { Rating, RatingHistory, IRatingHistory, IRating } from "./rating.model"

export class RatingController {
  constructor() {
    Rating.deleteMany({}).exec()
    RatingHistory.deleteMany({}).exec()
  }

  async update_avg_rating(identifier: string) {
    //compute new avg rating for history
    let ratings = await Rating.find({ identifier: identifier }).exec()
    let avg_rating =
      ratings.map((a) => a.rating).reduce((a, b) => a + b, 0) / ratings.length
    await new RatingHistory({
      identifier: identifier,
      rating: avg_rating,
      timestamp: new Date()
    }).save()
    
    //insert new overall avg rating for history
    let all_ratings = await Rating.find().exec()
    let overall_avg_rating = ratings
      .map((a) => a.rating)
      .reduce((a, b) => a + b, 0)
    overall_avg_rating /= all_ratings.length != 0 ? all_ratings.length : 1
    await new RatingHistory({
      identifier: "overall",
      rating: avg_rating,
      timestamp: new Date()
    }).save()
  }

  async rating_timeline(
    identifier: string = "overall"
  ): Promise<IRatingHistory[]> {
    let ratings = await RatingHistory.find({ identifier: identifier }).exec()
    return ratings.map((v, index) => {return {
      rating: v.rating,
      timestamp: v.timestamp,
    }})
  }

  async get_avg_rating(identifier: string = "overall"): Promise<number> {
    let result = await RatingHistory.find({ identifier }, {})
      .sort({timestamp: -1})
      .limit(1)
      .exec()
    return result.length == 1 ? result[0].rating : 0
  }

  async get_nr_ratings(identifier?: string): Promise<number> {
    return await Rating.countDocuments({ identifier: identifier }).exec()
  }

  async get_rating_by_user(
    identifier: string,
    username: string
  ): Promise<number | undefined> {
    let rating = await Rating.findOne({
      identifier: identifier,
      username: username
    }).exec()
    return rating ? rating.rating : undefined
  }

  async rate(identifier: string, rating: number, username: string) {
    rating = Math.min(Math.max(0, rating), 10)
    await Rating.updateOne(
      { identifier: identifier, username: username },
      { rating: rating, timestamp: new Date() },
      { upsert: true }
    ).exec()
    await this.update_avg_rating(identifier)
  }
}
