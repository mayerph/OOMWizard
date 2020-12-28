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
        file: config.storage.templates.route + "/Drake-Hotline-Bling.jpg"
      },
      {
        name: "pigeon",
        file: config.storage.templates.route + "/Is-This-A-Pigeon.jpg"
      },
      {
        name: "monkey",
        file: config.storage.templates.route + "/Monkey-Puppet.jpg"
      },
      {
        name: "balloon",
        file: config.storage.templates.route + "/Running-Away-Balloon.jpg"
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
            file: config.storage.templates.route + "/" + image.name
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

  /**
   * check if object is of type memeTemplate
   * @param object meme object
   * @param withId should the id property be considered
   */
  instanceOfMemeTemplate(
    object: any,
    withId?: boolean
  ): object is IMemeTemplate {
    if (typeof object != "object") {
      return false
    }
    const id = withId ? "id" in object : true
    const name = "name" in object
    const file = "file" in object
    return name && id && file
  }

  /**
   * update certain meme template
   * @param id memeTemplate id
   * @param object memeTemplate object
   */
  async updateMemeTemplate(
    id: string,
    object: any
  ): Promise<IMemeTemplate | null> {
    return new Promise(async (resolve, reject) => {
      // check if the sent object is of type memeTemplate
      if (!this.instanceOfMemeTemplate(object, true) && id != object.id) {
        reject("type error. Object of type memeTemplate is needed")
        return
      }

      // query for a template
      let template = null
      try {
        template = await MemeTemplate.findById(id)
      } catch (err) {
        reject(`no template with id ${id} found`)
        return
      }
      // check if a template has been found
      if (!template) {
        reject(`no template with id ${id} found`)
        return
      }

      // update template
      try {
        const updatedTemplate = await template.updateOne(object)
      } catch (err) {
        reject(`memeTemplate couldn't be updated`)
        return
      }

      resolve(template)
      return
    })
  }
}
