import { IUser } from "./user.interface"
import { v4 as uuidv4 } from "uuid"
import { User } from "./user.model"
import { Login } from "../login/login.model"

export class UserController {
  constructor() {}

  /**
   * add new user
   * @param object - user object
   *
   * throws error if user already exists
   */
  async addUser(
    name: string,
    salt: string,
    saltedHashedPassword: string
  ): Promise<IUser> {
    if (await User.findOne({ name: name }).exec()) {
      throw new Error("User already exists.")
    }
    //creating user first, then it's login
    console.log("Creating user", name)
    const user = new User({ name: name })
    await user.save()
    await new Login({
      username: name,
      salt: salt,
      saltedHashedPassword: saltedHashedPassword
    }).save()
    console.log("Created user", name)
    return user
  }

  /**
   * delete certain User
   */
  async deleteUser(username: string) {
    //First delete the login for a user, then the user
    console.log("Deleting user:", username)
    await Login.deleteOne({ username: username }).exec()
    await User.deleteOne({ name: username }).exec()
  }

}
