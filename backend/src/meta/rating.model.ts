import * as mongoose from "mongoose"
import { ICommentMongoose } from "../comments/comments.model"

const transform = (doc: any, ret: any) => {
  ret.id = ret.id
  delete ret._id
  delete ret.__v
}

export interface IRating {
  username: String
  identifier: String
  rating: number
  timestamp: Date
}
export interface IRatingModel {}
export interface IRatingMongoose extends IRating, mongoose.Document {}
interface IRatingModelMongoose
  extends IRatingModel,
    mongoose.Model<IRatingMongoose> {}

const ratingSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    identifier: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    timestamp: {
      type: Date,
      required: true
    }
  },
  {
    toJSON: { transform },
    toObject: { transform }
  }
)

export const Rating = mongoose.model<IRatingMongoose, IRatingModelMongoose>(
  "Rating",
  ratingSchema
)

export interface IRatingHistory {
  timestamp: Date
  rating: number
}
interface IRatingHistoryModel {}
interface IRatingHistoryMongoose extends IRatingHistory, mongoose.Document {}
interface IRatingHistoryModelMongoose
  extends IRatingHistoryModel,
    mongoose.Model<IRatingHistoryMongoose> {}

const ratingHistorySchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    timestamp: {
      type: Date,
      required: true
    }
  },
  {
    toJSON: { transform },
    toObject: { transform }
  }
)

export const RatingHistory = mongoose.model<
  IRatingHistoryMongoose,
  IRatingHistoryModelMongoose
>("RatingHistory", ratingHistorySchema)
