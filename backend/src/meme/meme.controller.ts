import { ITemplate } from "../template/template.interface"
import { v4 as uuidv4 } from "uuid"
import { ITemplateMongoose, Template } from "../template/template.model"
import { IUser } from "../user/user.interface"
import * as fs from "fs"
import * as config from "../config.json"
import * as Jimp from "jimp"
import { Canvas, createCanvas, Image, loadImage } from "canvas"
import { ICaption, IMeme } from "./meme.interface"
import { Meme } from "./meme.model"

export class MemeController {
  constructor() {
    this.insertTestData()
  }
  /**
   * initiate test environment with some sample data
   */
  insertTestData() {
    Meme.deleteMany({}).exec()
  }
  /**
   * returns all available memes
   */
  async memes(): Promise<IMeme[]> {
    const memes: IMeme[] = await Meme.find()
    return memes
  }

  /**
   * returns certain meme
   */
  async meme(id: string): Promise<IMeme | null> {
    const meme = await Meme.findById(id)
    return meme
  }
  /**
   * create and add new meme
   * @param meme metadata of the meme
   */
  async addMeme(meme: IMeme): Promise<IMeme> {
    try {
      // create canvas
      const canvas = await this.createMemeCanvas(meme)

      // write meme to filesystem
      const fullMeme = await this.writeMemeToFile(canvas, meme)

      // write meme to database
      const result = await new Meme(fullMeme).save()
      return fullMeme
    } catch (err) {
      throw err
    }
  }

  /**
   * write meme/canvas down to file system
   * @param canvas the image data
   * @param meme metadata of the file
   */
  writeMemeToFile(canvas: Canvas, meme: IMeme): Promise<IMeme> {
    // write to file system
    return new Promise((resolve, reject) => {
      const filename = new Date().getTime() + "_" + meme.template.name
      fs.writeFile(
        "./" + config.storage.memes.path + filename,
        canvas.toBuffer(),
        (err) => {
          if (err) {
            reject(err)
          }
          const fullMeme = {
            name: filename,
            route: config.storage.memes.route + "/" + filename,
            template: meme.template,
            captions: meme.captions
          }
          resolve(fullMeme)
        }
      )
    })
  }

  /**
   * creates the meme according to the meme object
   * @param meme data to generate a meme
   */
  createMemeCanvas(meme: IMeme): Promise<Canvas> {
    return new Promise(async (resolve, reject) => {
      // load template
      let img: Image = new Image()
      try {
        img = await loadImage(
          "./" + config.storage.templates.path + meme.template.name
        )
      } catch (err) {
        reject(err)
        return
      }
      const canvas = createCanvas(img.width, img.height)
      const ctx = canvas.getContext("2d")

      // draw image
      ctx.drawImage(img, 0, 0)

      // for each caption write to file
      meme.captions.forEach((caption) => {
        ctx.font = `${caption.size}pt Impact`
        ctx.fillStyle = caption.color

        // write text
        const text = caption.text
        ctx.fillText(
          text,
          caption.position.x,
          caption.position.y + caption.size
        )
      })
      resolve(canvas)
      return
    })
  }
}
