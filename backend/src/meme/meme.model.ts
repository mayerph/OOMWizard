import { model, Schema, Model, Document } from "mongoose"
import { IMeme, IMemeModel } from "./meme.interface"
import * as config from "../config.json"

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
  ret.file = config.storage.templates.route + "/" + ret.file
  delete ret._id
  delete ret.__v
}
const memeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      dropDups: true
    },
    file: {
      type: String,
      required: true,
      dropDups: true
    },
    capture1: {
      type: String,
      dropDups: true
    },
    capture2: {
      type: String,
      dropDups: true
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

export const Meme = model<IMemeMongoose, IMemeModelMongoose>("Meme", memeSchema)
