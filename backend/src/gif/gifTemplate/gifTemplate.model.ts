import { model, Schema, Model, Document } from "mongoose"
import { IGifTemplate, IGifTemplateModel } from "./gifTemplate.interface"

import { IDelay, IFrame } from "../../imageVector/imageVector.interface"
import * as config from "../../config.json"

/**
 * interface of the mongoose-schema
 * can be used to define properties and non-static methods
 */
export interface IGifTemplateMongoose extends IGifTemplate, Document {}

/**
 * interface of the mongoose-model
 * can be used defining static methods
 */
interface IGifTemplateModelMongoose
  extends Model<IGifTemplateMongoose>,
    IGifTemplateModel {}

const transform = (doc: any, ret: any) => {
  ret.id = ret._id
  delete ret._id
  delete ret.__v
}
/**
 * Mongoose Schema for delay
 */
const delaySchema = new Schema(
  {
    numerator: { type: Number, required: true },
    denominator: { type: Number, required: true }
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

/**
 * Mongoose Schema for a frame
 */
export const frameSchema = new Schema(
  {
    delay: { type: delaySchema, required: true },
    file: { type: String, required: true },
    left: { type: Number, required: true },
    top: { type: Number, required: true },
    route: { type: String, required: true }
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

/**
 * The gifTemplate Schema for mongoose
 */
export const gifTemplateSchema = new Schema(
  {
    file: { type: String, required: true },
    route: { type: String, required: true },
    frames: { type: [frameSchema], required: true },
    timestamp: { type: Date, required: false },
    thumbnail: { type: String, required: true },
    owner: { type: String, required: false },
    access: {
      type: String,
      enum: ["private", "unlisted", "public"],
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

export const GifTemplate = model<
  IGifTemplateMongoose,
  IGifTemplateModelMongoose
>("GifTemplate", gifTemplateSchema)
