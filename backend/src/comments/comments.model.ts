import * as mongoose from "mongoose"

export interface IComment {
  username: String
  timestamp: Date
  comment: String
}

export interface ICommentModel {}
export interface ICommentMongoose extends IComment, mongoose.Document {}

interface ICommentModelMongoose
  extends ICommentModel,
    mongoose.Model<ICommentMongoose> {}

const transform = (doc: any, ret: any) => {
  ret.id = ret.id
  delete ret._id
  delete ret.__v
}

const commentSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      required: false
    },
    comment: {
      type: String,
      required: true
    }
  },
  {
    toJSON: { transform },
    toObject: { transform }
  }
)

export const Comment = mongoose.model<ICommentMongoose, ICommentModelMongoose>(
  "Comment",
  commentSchema
)
