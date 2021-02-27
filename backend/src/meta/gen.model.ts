import * as mongoose from "mongoose"

export interface IGeneratedMeme {
  identifier: String
  timestamp: Date
}

export interface IGeneratedMemeModel {}
export interface IGeneratedMemeMongoose
  extends IGeneratedMeme,
    mongoose.Document {}

interface IGeneratedMemeModelMongoose
  extends IGeneratedMemeModel,
    mongoose.Model<IGeneratedMemeMongoose> {}

const transform = (doc: any, ret: any) => {
  ret.id = ret.id
  delete ret._id
  delete ret.__v
}

const genSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
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

export const GeneratedMeme = mongoose.model<
  IGeneratedMemeMongoose,
  IGeneratedMemeModelMongoose
>("GeneratedMeme", genSchema)
