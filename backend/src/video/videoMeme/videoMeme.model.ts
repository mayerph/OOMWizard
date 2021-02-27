import { model, Schema, Model, Document } from "mongoose"
import { IVideoMeme, IVideoMemeModel } from "./videoMeme.interface"

/**
 * interface of the mongoose-schema
 * can be used to define properties and non-static methods
 */
export interface IVideoMemeMongoose extends IVideoMeme, Document {}

/**
 * interface of the mongoose-model
 * can be used defining static methods
 */
interface IVideoMemeModelMongoose
  extends Model<IVideoMemeMongoose>,
    IVideoMemeModel {}

const transform = (doc: any, ret: any) => {
  ret.id = ret._id
  delete ret._id
  delete ret.__v
}

/**
 * The videoMeme Schema
 */
const videoMemeSchema = new Schema(
  {
    file: {
      type: String
    },
    route: {
      type: String
    },
    timestamp: {
      type: Date,
      required: false
    }
  },
  {
    toJSON: {
      transform
    },
    toObject: {
      transform
    }
  }
)

export const VideoMeme = model<IVideoMemeMongoose, IVideoMemeModelMongoose>(
  "VideoMeme",
  videoMemeSchema
)
