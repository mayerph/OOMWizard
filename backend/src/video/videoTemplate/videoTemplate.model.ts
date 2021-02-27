import { model, Schema, Model, Document } from "mongoose"
import { IVideoTemplate, IVideoTemplateModel } from "./videoTemplate.interface"

import { IDelay, IFrame } from "../../imageVector/imageVector.interface"
import * as config from "../../config.json"

/**
 * interface of the mongoose-schema
 * can be used to define properties and non-static methods
 */
export interface IVideoTemplateMongoose extends IVideoTemplate, Document {}

/**
 * interface of the mongoose-model
 * can be used defining static methods
 */
interface IVideoTemplateModelMongoose
  extends Model<IVideoTemplateMongoose>,
    IVideoTemplateModel {}

const transform = (doc: any, ret: any) => {
  ret.id = ret._id
  delete ret._id
  delete ret.__v
}

/**
 * Mongoose Schema for a video frame
 */
export const frameSchema = new Schema(
  {
    file: { type: String, required: true },
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
 * the frameVector Schema for mongoose
 */
export const frameVector = new Schema(
  {
    frames: { type: [frameSchema], required: true },
    fps: { type: String, required: true }
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
 * The videoTemplate Schema for mongoose
 */
export const videoTemplateSchema = new Schema(
  {
    file: { type: String, required: true },
    route: { type: String, required: true },
    audio: { type: String, required: true },
    frames: { type: frameVector, required: true },
    thumbnail: { type: String, required: true },
    timestamp: { type: Date, required: false },
    owner: { type: String, required: false },
    access: {
      type: String,
      enum: ["private", "unlisted", "public"],
      required: false
    },
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

export const VideoTemplate = model<
  IVideoTemplateMongoose,
  IVideoTemplateModelMongoose
>("VideoTemplate", videoTemplateSchema)
