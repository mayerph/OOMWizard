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

const transform = (doc: any, ret: any) => {
  ret.id = ret._id
  ret.file = config.storage.templates.route + "/" + ret.file
  delete ret._id
  delete ret.__v
}
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

export const MemeTemplate = model<
  IMemeTemplateMongoose,
  IMemeTemplateModelMongoose
>("MemeTemplate", memeTemplateSchema)
