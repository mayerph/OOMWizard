import { model, Schema, Model, Document } from "mongoose"
import { IGifMeme, IGifMemeModel } from "./gifMeme.interface"
import * as config from "../../config.json"
import { GifTemplate } from "../gifTemplate/gifTemplate.model"
import { gifTemplateSchema } from "../gifTemplate/gifTemplate.model"
import { frameSchema } from "../gifTemplate/gifTemplate.model"
import { captionSchema } from "../../meme/meme.model"
/**
 * interface of the mongoose-schema
 * can be used to define properties and non-static methods
 */
export interface IGifMemeMongoose extends IGifMeme, Document {}

/**
 * interface of the mongoose-model
 * can be used defining static methods
 */
interface IGifMemeModelMongoose
  extends Model<IGifMemeMongoose>,
    IGifMemeModel {}

const transform = (doc: any, ret: any) => {
  ret.id = ret._id
  delete ret._id
  delete ret.__v
}

/**
 * The gifMeme Schema
 */
const gifMemeSchema = new Schema(
  {
    file: {
      type: String
    },
    timestamp: {
      type: Date,
      required: false,
    },
    route: {
      type: String
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

export const GifMeme = model<IGifMemeMongoose, IGifMemeModelMongoose>(
  "GifMeme",
  gifMemeSchema
)
