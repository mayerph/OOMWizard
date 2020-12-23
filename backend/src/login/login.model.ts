import * as mongoose from "mongoose"

export interface ILogin {
  username: string
  salt: string
  saltedHashedPassword: string
}
export interface ILoginModel {}
export interface ILoginMongoose extends ILogin, mongoose.Document {}
interface ILoginModelMongoose
  extends ILoginModel,
    mongoose.Model<ILoginMongoose> {}

const loginSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    dropDups: true
  },
  salt: {
    type: String,
    required: true
  },
  saltedHashedPassword: {
    type: String,
    required: true
  }
})

export const Login = mongoose.model<ILoginMongoose, ILoginModelMongoose>(
  "Login",
  loginSchema
)
