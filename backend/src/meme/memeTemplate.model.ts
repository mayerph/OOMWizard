import { model, Schema, Model, Document } from "mongoose"
import { IMemeTemplate, IMemeTemplateModel } from "./memeTemplate.interface"
import * as config from "../config.json"

/**
 * interface of the mongoose-schema
 * can be used to define properties and non-static methods
 */
export interface IMemeTemplateMongoose extends IMemeTemplate, Document {}

/**
 * interface of the mongoose-model
 * can be used defining static methods
 */
interface IMemeTemplateModelMongoose
  extends Model<IMemeTemplateMongoose>,
    IMemeTemplateModel {}

/**
 * renames certain properties and deletes unnecessary properties
 * @param doc the certain document
 * @param ret the memeTemplate object
 */
const transform = (doc: any, ret: any) => {
  ret.id = ret._id
  delete ret._id
  delete ret.__v
}

/**
 * mongoose schema for a meme template
 */
export const memeTemplateSchema = new Schema(
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

/**
 * mongoose model for a meme template
 */

export const MemeTemplate = model<
  IMemeTemplateMongoose,
  IMemeTemplateModelMongoose
>("MemeTemplate", memeTemplateSchema)
