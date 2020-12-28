import { IMemeTemplate } from "./memeTemplate.interface"
import { v4 as uuidv4 } from "uuid"
import { IMemeTemplateMongoose, MemeTemplate } from "./memeTemplate.model"
import { IUser } from "../user/user.interface"
import * as fs from "fs"
import * as config from "../config.json"

export class MemeController {
  constructor() {
    this.insertTestData()
  }
  /**
   * initiate test environment with some sample data
   */
  insertTestData() {
    MemeTemplate.deleteMany({}).exec()
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
    memes_tmp.forEach((e) => new MemeTemplate(e).save())
  }
  /**
   * returns all available meme template
   */
  async memes(): Promise<IMemeTemplate[]> {
    const memes: IMemeTemplate[] = await MemeTemplate.find()
    return memes
  }

  /**
   * returns certain meme template
   */
  async meme(
    id: string,
    caption1?: string,
    caption2?: string
  ): Promise<IMemeTemplate | null> {
    const meme = await MemeTemplate.findById(id)

    if (meme && caption1) {
      // meme["caption1"] = caption1
    }
    if (meme && caption2) {
      // meme["caption2"] = caption2
    }
    return meme
  }

  /**
   * write image to file
   * @param image object with the image (meta)data
   */
  writeMemeTemplate(image: any): Promise<IMemeTemplate> {
    return new Promise((resolve, reject) => {
      if (!image.data || !image.name) {
        reject(new Error("no image data"))
      }
      fs.writeFile(
        "./" + config.storage.templates.path + image.name,
        image.data,
        async (err) => {
          if (err) {
            reject(err)
          }
          const memeDoc: IMemeTemplate = {
            name: image.name,
            file: image.name
          }
          try {
            const meme = await new MemeTemplate(memeDoc).save()
            resolve(meme)
          } catch (err) {
            reject(err)
          }
        }
      )
    })
  }
}
