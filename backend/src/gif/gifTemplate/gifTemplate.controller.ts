import { IGifTemplate } from "./gifTemplate.interface"
import { GifTemplate } from "./gifTemplate.model"
import * as fs from "fs"
import * as config from "../../config.json"
import * as uuid from "uuid"
import * as gif from "gifEndecoder"
import * as path from "path"

import { filter_accessible, is_accessible } from "../../user/ownership"
import { ViewsController } from "../../meta/views.controller"
import { IFrame } from "../../imageVector/imageVector.interface"
const viewsController = new ViewsController()

export class GifTemplateController {
  constructor() {
    GifTemplate.deleteMany({}).exec()
    this.createNecessaryDirectories()
  }

  /**
   * creates all directories necessary for memes
   */
  createNecessaryDirectories(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const path1 = path.resolve(`./${config.storage.gifs.templates.path}`)
      const paths = [path1]
      const pathPromises = paths.map((path) => {
        return new Promise(async (resolve, reject) => {
          try {
            const result = await this.createDirectory(path)
            resolve(result)
          } catch (err) {
            reject(err)
          }
        })
      })
      Promise.all(pathPromises)
        .then(() => {
          resolve(true)
        })
        .catch((err) => {
          reject(false)
        })
    })
  }
  /**
   * creates a directory structure for the given path.
   * @param path path to the directory which should be created
   */
  createDirectory(path: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fs.mkdir(path, { recursive: true }, (err) => {
        if (err) return reject(false)
        resolve(true)
      })
    })
  }
  /**
   * returns all available gif templates
   */
  async gifTemplates(username?: String): Promise<IGifTemplate[]> {
    var gifTemplates: IGifTemplate[] = await GifTemplate.find()
    gifTemplates = filter_accessible(gifTemplates, false, username)
    for (var meme of gifTemplates) {
      viewsController.notify_view(meme.id, username)
    }
    return gifTemplates
  }

  /**
   * returns certain gif template
   */
  async gifTemplate(
    id: string,
    username?: String
  ): Promise<IGifTemplate | null> {
    var gifTemplate = await GifTemplate.findById(id)
    gifTemplate =
      gifTemplate && is_accessible(gifTemplate, true, username)
        ? gifTemplate
        : null
    if (gifTemplate) {
      viewsController.notify_view(gifTemplate.id, username)
    }
    return gifTemplate
  }

  /**
   * update certain gif template
   * @param id gifTemplate id
   * @param object gifTemplate object
   */
  async updateGifTemplate(
    id: string,
    object: any
  ): Promise<IGifTemplate | null> {
    return new Promise(async (resolve, reject) => {
      // check if the sent object is of type memeTemplate
      if (!this.instanceOfGifTemplate(object, true) && id != object.id) {
        reject("type error. Object of type gifTemplate is needed")
        return
      }

      // query for a template
      let gifTemplate = null
      try {
        gifTemplate = await GifTemplate.findById(id)
      } catch (err) {
        reject(`no template with id ${id} found`)
        return
      }
      // check if a gifTemplate has been found
      if (!gifTemplate) {
        reject(`no template with id ${id} found`)
        return
      }

      // update gifTemplate
      try {
        const updatedTemplate = await gifTemplate.updateOne(object)
      } catch (err) {
        reject(`memeTemplate couldn't be updated`)
        return
      }

      resolve(object)
      return
    })
  }

  /**
   * check if object is of type GifTemplate
   * @param object gifTemplate object
   * @param withId should the id property be considered
   */
  instanceOfGifTemplate(object: any, withId?: boolean): object is IGifTemplate {
    if (typeof object != "object") {
      return false
    }
    const id = withId ? "id" in object : true
    const frames = "frames" in object
    const file = "file" in object
    return frames && id && file
  }

  /**
   * delete certain gif template
   * @param id gifTemplate id
   */
  async deleteGifTemplate(id: string): Promise<IGifTemplate> {
    return new Promise(async (resolve, reject) => {
      // query for a gifTemplate
      let gifTemplate = null
      try {
        gifTemplate = await GifTemplate.findById(id)
      } catch (err) {
        reject(`no gifTemplate with id ${id} found`)
        return
      }
      // check if a gifTemplate has been found
      if (!gifTemplate) {
        reject(`no gifTemplate with id ${id} found`)
        return
      }
      // delete gifTemplate in storage
      const filepath =
        "./" + config.storage.gifs.templates.path + gifTemplate.id + "/"
      if (fs.existsSync(filepath)) {
        fs.rmdirSync(filepath, { recursive: true })
      }

      // delete gifTemplate
      try {
        const result = await gifTemplate.deleteOne()
        resolve(gifTemplate)
        return
      } catch (err) {
        reject(`gifTemplate couldn't be updated`)
        return
      }
    })
  }

  //FIXME post gif template?
  /**
   * write image to file
   * @param image object with the image (meta)data
   */
  writeGifTemplate(image: any): Promise<IGifTemplate> {
    return new Promise(async (resolve, reject) => {
      if (!image.data || !image.name) {
        reject(new Error("no image data"))
      }

      const gifTemplateDoc: IGifTemplate = {
        file: "",
        route: "",
        frames: [],
        thumbnail: "..",
        timestamp: new Date()
      }

      const gifTemplate = new GifTemplate(gifTemplateDoc)

      // create directory for gif template
      const filepath =
        "./" + config.storage.gifs.templates.path + gifTemplate.id + "/"
      fs.mkdirSync(filepath)

      // create directory for frames
      const dstDirectory = filepath + "frames"
      fs.mkdirSync(dstDirectory)

      const srcFile = filepath + image.name

      fs.writeFileSync(srcFile, image.data)
      const gifMeta = await this.decodeGif(srcFile, dstDirectory)

      gifTemplate.file = gifMeta.file
      gifTemplate.route = `${config.storage.gifs.templates.route}/${gifTemplate.id}/${image.name}`

      const framesTemp: IFrame[] = []
      const t = [...gifMeta.frames]

      t.forEach((f) => {
        framesTemp.push({
          delay: f.delay,
          file: f.file,
          left: f.left,
          top: f.top,

          route: `${config.storage.gifs.templates.route}/${
            gifTemplate.id
          }/frames/${path.basename(f.file)}`
        })
      })

      gifTemplate.frames = framesTemp

      gifTemplate.thumbnail = gifTemplate.frames[0].route

      try {
        await gifTemplate.save()

        resolve(gifTemplate)
      } catch (err) {
        reject(err)
      }
    })
  }
  decodeGif(srcFile: string, dstDirectory: string): Promise<any> {
    return new Promise((resolve, reject) => {
      gif.decodeGif(srcFile, dstDirectory, (err: any, result: any) => {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }
}
