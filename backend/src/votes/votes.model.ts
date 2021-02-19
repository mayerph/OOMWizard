import * as mongoose from "mongoose"
import { ICommentMongoose } from "../comments/comments.model"

export interface IVote{
  username: String
  meme_id: String
}

export interface IVoteModel{}
export interface IVoteMongoose extends IVote, mongoose.Document{}

interface IVoteModelMongoose extends IVoteModel, mongoose.Model<IVoteMongoose>{}

const transform = (doc:any, ret:any) =>{
  ret.id = ret.id
  delete ret._id
  delete ret.__v
}

const likeSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    meme_id: {
      type: String,
      required: true,
    }
  },
  {
    toJSON: {transform},
    toObject: {transform},
  },
)

export const Like = mongoose.model<IVoteMongoose, IVoteModelMongoose>(
  "Like",
  likeSchema,
)