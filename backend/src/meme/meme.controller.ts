import { IMeme } from "./meme.interface"
import { v4 as uuidv4 } from "uuid"
import { IMemeMongoose, Meme } from "./meme.model"
import { IUser } from "../user/user.interface"
import * as fs from "fs"
import * as config from "../config.json"

export class MemeController {
  constructor() {
    this.insertTestData()
  }

  insertTestData() {
    const memes_tmp = [
      {
        name: "drake",
        file: "Drake-Hotline-Bling.jpg"
      },
      {
        name: "pigeon",
        file: "Is-This-A-Pigeon.jpg"
      },
      {
        name: "monkey",
        file: "Monkey-Puppet.jpg"
      },
      {
        name: "balloon",
        file: "Running-Away-Balloon.jpg"
      }
    ]
    memes_tmp.forEach((e) => new Meme(e).save())
  }

  async memes(): Promise<IMeme[]> {
    const memes: IMeme[] = await Meme.find()
    return memes
  }

  writeMemeTemplate(image: any) {
    return new Promise((resolve, reject) => {
      if (image.data && image.name) {
        fs.writeFile(
          "./" + config.storage.templates.path + image.name,
          image.data,
          async (err) => {
            if (err) {
              reject()
            }
            const memeDoc: IMeme = {
              name: image.name,
              file: image.name
            }
            const meme = await new Meme(memeDoc).save()
            resolve(meme)
          }
        )
      }
    })
  }
}
