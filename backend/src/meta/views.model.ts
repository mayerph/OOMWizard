import * as mongoose from "mongoose"

export interface IViews {
  username: String
  identifier: String
  timestamp: Date
}

export interface IViewsModel {}
export interface IViewsMongoose extends IViews, mongoose.Document {}

interface IViewsModelMongoose
  extends IViewsModel,
    mongoose.Model<IViewsMongoose> {}

const transform = (doc: any, ret: any) => {
  ret.id = ret.id
  delete ret._id
  delete ret.__v
}

const viewsSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
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

export const Views = mongoose.model<IViewsMongoose, IViewsModelMongoose>(
  "Views",
  viewsSchema
)
