import { IUser } from "./user.interface";
import { v4 as uuidv4 } from "uuid";
import { User } from "./user.model";

export class UserController {
  users: IUser[] = [
    { id: uuidv4(), name: "user1" },
    { id: uuidv4(), name: "user2" },
    { id: uuidv4(), name: "user3" }
  ];
  constructor() {}

  /**
   * get a certain user
   * @param id - users id
   */
  async getUserById(id: string): Promise<IUser | undefined> {
    const users = this.users.filter((e) => e.id === id);
    if (users.length > 0) {
      return users[0];
    }
    return undefined;
  }

  /**
   * update certain user
   * @param id - users id
   * @param object - changed user object
   */
  async updateUser(id: string, object: any): Promise<IUser | undefined> {
    if (!this.instanceOfUser(object, true) && id != object.id) {
      return undefined;
    }
    this.users = this.users.map((e) => {
      if (e.id === id) {
        return object;
      }
      return e;
    });
    return object;
  }

  /**
   * add certain user
   * @param object - user object
   * @param withId - should the id property be considered
   */
  instanceOfUser(object: any, withId?: boolean): object is IUser {
    const id = withId ? "name" in object : true;
    const name = "name" in object;
    return name && id;
  }

  /**
   * add new user
   * @param object - user object
   */
  async addUser(object: any): Promise<IUser | undefined> {
    if (!this.instanceOfUser(object)) {
      return undefined;
    }
    const user = new User({ name: object.name });
    await user.save();
    console.log("the user is", user);
    return user;
  }

  /**
   * delete certain User
   * @param id - user id
   */
  async deleteUser(id: string): Promise<IUser[]> {
    this.users = this.users.filter((u) => id !== u.id);
    return this.users;
  }

  /**
   * return all Users
   */
  async getUsers() {
    try {
      const users = await User.find({})
        .exec()
        .catch((e) => {
          throw new Error("");
        });
      return users;
    } catch (e) {
      throw e;
    }
  }
}
