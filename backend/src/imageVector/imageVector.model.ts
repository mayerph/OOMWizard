import { model, Schema, Model, Document } from "mongoose"
import { IImageVector, ImageVectorModel } from "./imageVector.interface"

/**
 * interface of the mongoose-schema
 * can be used to define properties and non-static methods
 */
export interface ImageVectorMongoose extends IImageVector, Document {}

/**
 * interface of the mongoose-model
 * can be used defining static methods
 */
interface ImageVectorModelMongoose
  extends Model<ImageVectorMongoose>,
    ImageVectorModel {}

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
 * The imageVector Schema for mongoose
 */
export const imageVectorSchema = new Schema(
  {
    file: { type: String, required: true },
    route: { type: String, required: true },
    frames: { type: [frameSchema], required: true }
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

export const ImageVector = model<ImageVectorMongoose, ImageVectorModelMongoose>(
  "ImageVector",
  imageVectorSchema
)
