import * as mongoose from "mongoose"
import { ICommentMongoose } from "../comments/comments.model"

export interface IRating{
  username: String
  meme_id: String
  rating: number
}

export interface IRatingModel{}
export interface IRatingMongoose extends IRating, mongoose.Document{}

interface IRatingModelMongoose extends IRatingModel, mongoose.Model<IRatingMongoose>{}

const transform = (doc:any, ret:any) =>{
  ret.id = ret.id
  delete ret._id
  delete ret.__v
}

const ratingSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    meme_id: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },

  },
  {
    toJSON: {transform},
    toObject: {transform},
  },
)

export const Rating = mongoose.model<IRatingMongoose, IRatingModelMongoose>(
  "Rating",
  ratingSchema,
)