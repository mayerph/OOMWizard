import { ITemplate } from "./template.interface"
import { ITemplateMongoose, Template } from "./template.model"
import * as config from "../config.json"
import * as fs from "fs"
import * as mongoose from "mongoose"

import { filter_accessible, is_accessible } from "../user/ownership"

import {ViewsController} from '../meta/views.controller'
const viewsController = new ViewsController()

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
        _id: mongoose.Types.ObjectId("5ff446fa4de819687770bfac"),
        name: "Drake-Hotline-Bling.jpg",
        timestamp: new Date(),
        route:
          config.storage.images.templates.route + "/Drake-Hotline-Bling.jpg"
      },
      {
        _id: mongoose.Types.ObjectId("5ff446fa4de819687770bfad"),
        name: "Is-This-A-Pigeon.jpg",
        timestamp: new Date(),
        route: config.storage.images.templates.route + "/Is-This-A-Pigeon.jpg"
      },
      {
        _id: mongoose.Types.ObjectId("5ff446fa4de819687770bfae"),
        name: "Monkey-Puppet.jpg",
        timestamp: new Date(),
        route: config.storage.images.templates.route + "/Monkey-Puppet.jpg"
      },
      {
        _id: mongoose.Types.ObjectId("5ff446fa4de819687770bfaf"),
        name: "Running-Away-Balloon.jpg",
        timestamp: new Date(),
        route:
          config.storage.images.templates.route + "/Running-Away-Balloon.jpg"
      }
    ]
    memes_tmp.forEach((e) => new Template(e).save())
  }
  /**
   * returns all available meme template
   */
  async templates(username?: String): Promise<ITemplate[]> {
    var templates: ITemplate[] = await Template.find()
    templates = filter_accessible(templates, false, username)
    for (var item of templates){
      viewsController.notify_view(item.id, username)
    }
    return templates
  }

  /**
   * returns certain meme template
   */
  async template(id: string, username?: string): Promise<ITemplate | null> {
    var template = await Template.findById(id)
    template = template && is_accessible(template, true, username)? template: null
    if (template){
      viewsController.notify_view(template.id, username)
    }
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

      resolve(object)
      return
    })
  }

  /**
   * delete certain meme template
   * @param id memeTemplate id
   */
  async deleteMemeTemplate(id: string): Promise<ITemplate> {
    return new Promise(async (resolve, reject) => {
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

      // delete template
      try {
        const result = await template.deleteOne()
        resolve(template)
        return
      } catch (err) {
        reject(`memeTemplate couldn't be updated`)
        return
      }
    })
  }

  /**
   * write image to file
   * @param image object with the image (meta)data
   */
  writeMemeTemplate(image: any, owner?: string, access?: string): Promise<ITemplate> {
    return new Promise((resolve, reject) => {
      if (!image.data || !image.name) {
        reject(new Error("no image data"))
      }
      fs.writeFile(
        "./" + config.storage.images.templates.path + image.name,
        image.data,
        async (err) => {
          if (err) {
            reject(err)
          }
          const memeDoc: ITemplate = {
            name: image.name,
            timestamp: new Date(),
            route: config.storage.images.templates.route + "/" + image.name,
            owner: owner,
            access: access,
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
