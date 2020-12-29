import { ITemplate } from "./template.interface"
import { ITemplateMongoose, Template } from "./template.model"
import * as config from "../config.json"
import * as fs from "fs"

export class TemplateController {
  constructor() {
    this.insertTestData()
  }
  /**
   * initiate test environment with some sample data
   */
  insertTestData() {
    Template.deleteMany({}).exec()
    const memes_tmp = [
      {
        name: "Drake-Hotline-Bling.jpg",
        route: config.storage.templates.route + "/Drake-Hotline-Bling.jpg"
      },
      {
        name: "Is-This-A-Pigeon.jpg",
        route: config.storage.templates.route + "/Is-This-A-Pigeon.jpg"
      },
      {
        name: "Monkey-Puppet.jpg",
        route: config.storage.templates.route + "/Monkey-Puppet.jpg"
      },
      {
        name: "Running-Away-Balloon.jpg",
        route: config.storage.templates.route + "/Running-Away-Balloon.jpg"
      }
    ]
    memes_tmp.forEach((e) => new Template(e).save())
  }
  /**
   * returns all available meme template
   */
  async templates(): Promise<ITemplate[]> {
    const templates: ITemplate[] = await Template.find()
    return templates
  }

  /**
   * returns certain meme template
   */
  async meme(id: string): Promise<ITemplate | null> {
    const template = await Template.findById(id)

    return template
  }

  /**
   * check if object is of type memeTemplate
   * @param object meme object
   * @param withId should the id property be considered
   */
  instanceOfMemeTemplate(object: any, withId?: boolean): object is ITemplate {
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
  async updateMemeTemplate(id: string, object: any): Promise<ITemplate | null> {
    return new Promise(async (resolve, reject) => {
      // check if the sent object is of type memeTemplate
      if (!this.instanceOfMemeTemplate(object, true) && id != object.id) {
        reject("type error. Object of type memeTemplate is needed")
        return
      }

      // query for a template
      let template = null
      try {
        template = await Template.findById(id)
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

  /**
   * write image to file
   * @param image object with the image (meta)data
   */
  writeMemeTemplate(image: any): Promise<ITemplate> {
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
          const memeDoc: ITemplate = {
            name: image.name,
            route: config.storage.templates.route + "/" + image.name
          }
          try {
            const meme = await new Template(memeDoc).save()
            resolve(meme)
          } catch (err) {
            reject(err)
          }
        }
      )
    })
  }
}
