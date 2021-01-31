import { model, Schema, Model, Document } from "mongoose"
import { IMeme, IMemeModel } from "./meme.interface"
import * as config from "../config.json"
import { templateSchema } from "../template/template.model"

/**
 * interface of the mongoose-schema
 * can be used to define properties and non-static methods
 */
export interface IMemeMongoose extends IMeme, Document {}

/**
 * interface of the mongoose-model
 * can be used defining static methods
 */
interface IMemeModelMongoose extends Model<IMemeMongoose>, IMemeModel {}

const transform = (doc: any, ret: any) => {
  ret.id = ret._id
  delete ret._id
  delete ret.__v
}
/**
 * Mongoose Schema for position
 */
const positionSchema = new Schema(
  {
    x: { type: String, required: true },
    y: { type: String, required: true }
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
 * Mongoose Schema for a capture (capture 1 and capture 2)
 */
export const captionSchema = new Schema(
  {
    text: { type: String, required: true },
    position: positionSchema
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
 * The meme Schema is a combination of the memeTemplateSchema and the captureSchema
 */
const memeSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    route: {
      type: String,
      required: true
    },
    template: {
      type: templateSchema,
      required: true
    },
    captions: { type: [captionSchema], required: true }
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

export const Meme = model<IMemeMongoose, IMemeModelMongoose>("Meme", memeSchema)
