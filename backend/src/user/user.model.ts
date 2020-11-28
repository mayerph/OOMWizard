import * as mongoose from 'mongoose'
import { IUser, IUserModel } from "./user.interface"

/**
 * interface of the mongoose-schema
 * can be used to define properties and non-static methods
 */
export interface IUserMongoose extends IUser, mongoose.Document {}

/**
 * interface of the mongoose-model
 * can be used defining static methods
 */
interface IUserModelMongoose
    extends mongoose.Model<IUserMongoose>,
        IUserModel {}


const transform = (doc: any, ret: any) => {
    ret.id = ret._id
    delete ret._id;
    delete ret.__v;
}
const userSchema = new mongoose.Schema({
    name : {
        type: String,
        unique: true, 
        required: true, 
        dropDups: true
    }
}, { 
    toJSON : {
        transform
    },
    toObject : {
        transform
    }})


export const User = mongoose.model<IUserMongoose, IUserModelMongoose>(
    'User',
    userSchema
)

