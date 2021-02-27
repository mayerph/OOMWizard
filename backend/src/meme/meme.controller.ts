import * as fs from "fs"
import * as config from "../config.json"
import { Canvas, createCanvas, Image, loadImage } from "canvas"
import { ICanvas, ICaption, IImage, IMeme } from "./meme.interface"
import { captionSchema, Meme } from "./meme.model"
import { Duplex } from "stream"
import * as uuid from "uuid"
import * as archiver from "archiver"
import { PassThrough } from "stream"
import * as mongoose from "mongoose"
import e = require("express")
import { filter_accessible, is_accessible } from "../user/ownership"

import {ViewsController} from '../meta/views.controller'
const viewsController = new ViewsController()

export class MemeController {
  constructor(insert: boolean) {
    if (insert) {
      this.insertTestData()
    }
  }
  /**
   * initiate test environment with some sample data
   */
  async insertTestData() {
    Meme.deleteMany({}).exec()
    const template_tmp = [
      {
        name: "d5703be0-4f5c-11eb-af94-1d9a1453b140.png",
        route: "/images/memes/d5703be0-4f5c-11eb-af94-1d9a1453b140.png",
        template: {
          name: "Drake-Hotline-Bling.jpg",
          route: "/images/templates/Drake-Hotline-Bling.jpg",
          _id: "5ff46e6a4b03de6df1d420c6"
        },
        captions: [
          {
            text: "hello world",
            position: {
              x: "0",
              y: "0",
              _id: "5ff46e6a4b03de6df1d420c8"
            },
            _id: "5ff46e6a4b03de6df1d420c7"
          }
        ],
        _id: mongoose.Types.ObjectId("5ff46e6a4b03de6df1d420c5")
      },
      {
        name: "d5703be0-4f5c-11eb-af94-1d9a1453b14.png",
        route: "/images/memes/d5703be0-4f5c-11eb-af94-1d9a1453b140.png",
        owner: "test1234",
        access: "unlisted",
        timestamp: new Date(),
        template: {
          name: "Drake-Hotline-Bling.jpg",
          route: "/images/templates/Drake-Hotline-Bling.jpg",
          _id: "aff46e6a4b03de6df1d420c9"
        },
        captions: [
          {
            text: "unlisted",
            position: {
              x: "0",
              y: "0",
              _id: "aff46e6a4b03de6df1d420b8"
            },
            _id: "aff46e6a4b03de6df1d420f7"
          }
        ],
        _id: mongoose.Types.ObjectId("aff46e6a4b03de6df1d420a5")
      }
    ]
    template_tmp.forEach((e) => new Meme(e).save())
  }

  /**
   * returns all available memes
   */
  async memes(username?: String): Promise<IMeme[]> {
    var memes: IMeme[] = await Meme.find()
    memes = filter_accessible(memes, false, username)
    for(var m of memes){
      viewsController.notify_view(m.id, username)
    }
    return memes
  }

  /**
   * returns certain meme
   */
  async meme(
    id: string,
    username?: String,
    show_unlisted: boolean = false
  ): Promise<IMeme | null> {
    var meme = await Meme.findById(id)
    meme =  meme && is_accessible(meme, show_unlisted, username) ? meme : null
    if (meme) {
      viewsController.notify_view(meme.id, username)
    }
    return meme
  }

  /**
   * delete certain meme
   * @param id memeTemplate id
   */
  async deleteMeme(id: string, username?: String): Promise<IMeme | null> {
    return new Promise(async (resolve, reject) => {
      // query for a meme
      let meme = null
      try {
        meme = await Meme.findById(id)
      } catch (err) {
        reject(`no meme with id ${id} found`)
        return
      }
      // check if a meme has been found
      if (!meme) {
        reject(`no meme with id ${id} found`)
        return
      }
      //check if a meme is owned by the user
      if (meme.owner !== username) {
        reject(`cannot delete meme from another user`)
        return
      }
      // delete meme
      try {
        const result = await meme.deleteOne()
        resolve(meme)
        return
      } catch (err) {
        reject(`meme couldn't be updated`)
        return
      }
    })
  }

  /**
   * create and add new meme
   * @param meme metadata of the meme
   */
  async addMeme(meme: IMeme, owner?: String, access?: String): Promise<IMeme> {
    try {
      // create filename
      const filename = this.createFilename()

      // create canvas
      const canvas = await this.createMemeCanvas(
        meme.captions,
        meme.template.name
      )

      // write meme to filesystem
      const filepath = await this.writeMemeToFile(canvas.toBuffer(), filename)

      const fullMeme = {
        name: filename,
        owner: owner,
        access: access,
        timestamp: new Date(),
        route: config.storage.images.memes.route + "/" + filename,
        template: meme.template,
        captions: meme.captions
      }

      // write meme to database
      const result = await new Meme(fullMeme).save()

      return result
    } catch (err) {
      throw err
    }
  }

  /**
   * converts a buffer to a readstream
   * @param buffer buffer representing the file
   */
  bufferToStream(buffer: Buffer) {
    const tmp = new Duplex()
    tmp.push(buffer)
    tmp.push(null)
    return tmp
  }

  /**
   * creates a unique filename
   * @param format format of the file (e.g. png | jpg)
   */
  createFilename(format?: string): string {
    return uuid.v1() + "." + (format ? format : "png")
  }

  async query_memes(
    query_str: string,
    limit?: number,
    username?: string
  ): Promise<IMeme[]> {
    let tokens = query_str.split(" ")
    let memes = await this.memes(username)
    memes = memes.filter((meme) => {
      return tokens.some((t) => {
        return (
          (meme.name && meme.name.includes(t)) ||
          meme.template.name.includes(t) ||
          meme.captions.some((cap) => {
            return cap.text.includes(t)
          })
        )
      })
    })
    return memes.slice(0, limit)
  }

  /**
   * creates a stream to enable downloading
   * @param meme object representing the image / meme
   * @param toFS decides if the meme should be written to the filesystem
   * @param toDS decides if the meme should be written to the database. Only has an impact if toFS is true
   */
  async memeFile(
    meme: IMeme,
    toFS?: boolean,
    toDB?: boolean
  ): Promise<{ stream: Duplex; filename: string }> {
    try {
      // create filename
      const filename = this.createFilename()

      // create canvas
      let canvas
      if (meme.images) {
        canvas = await this.createMultiImageMemeCanvas(
          meme.captions,
          meme.images,
          meme.canvas
        )
        toFS = true
        toDB = true
      } else {
        canvas = await this.createMemeCanvas(meme.captions, meme.template.name)
      }

      // write meme to filesystem
      if (toFS) {
        const filepath = await this.writeMemeToFile(canvas.toBuffer(), filename)
        // write to db
        if (toDB) {
          const fullMeme = {
            name: filename,
            route: config.storage.images.memes.route + "/" + filename,
            template: meme.template,
            captions: meme.captions
          }

          // write meme to database
          const result = await new Meme(fullMeme).save()
        }
      }

      const stream = this.bufferToStream(canvas.toBuffer())

      return { stream, filename }
    } catch (err) {
      throw err
    }
  }

  /**
   * creates a stream to enable downloading
   * @param meme object representing the image / meme
   * @param toFS decides if the meme should be written to the filesystem
   * @param toDS decides if the meme should be written to the database. Only has an impact if toFS is true
   */
  async zipFile(
    memes: IMeme[]
  ): Promise<{ zip: archiver.Archiver; filename: string }> {
    return new Promise(async (resolve, reject) => {
      try {
        const filename = this.createFilename("zip")
        const zip = archiver("zip")

        // create a list of promises
        const promises = memes.map((meme) => {
          return new Promise(async (resolve, reject) => {
            const { stream, filename } = await this.memeFile(meme)
            // if stream has finished (end) resolve promise
            stream
              .on("end", () => {
                resolve(true)
                return
              })
              .on("close", () => {
                resolve(true)
                return
              })
              .on("error", (err) => {
                reject(err)
                return
              })
            // add stream to zip archive
            zip.append(stream.pipe(new PassThrough()), { name: filename })
          })
        })
        // wait until all promises are resolved
        const result = await Promise.all(promises)

        // build final zip archive
        zip.finalize()

        resolve({ zip, filename })
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * write meme/canvas down to file system
   * @param canvas the image data
   * @param meme metadata of the file
   */
  writeMemeToFile(buffer: Buffer, filename: string): Promise<string> {
    // write to file system
    return new Promise((resolve, reject) => {
      const filepath = "./" + config.storage.images.memes.path + filename
      fs.writeFile(filepath, buffer, (err) => {
        if (err) {
          reject(err)
        }

        resolve(filepath)
      })
    })
  }

  /**
   * creates the meme according to the meme object
   * @param meme data to generate a meme
   */
  createMemeCanvas(
    captions: ICaption[],
    name: string,
    fullpath?: boolean
  ): Promise<Canvas> {
    return new Promise(async (resolve, reject) => {
      // load template
      let img: Image = new Image()
      try {
        img = await loadImage(
          (!fullpath ? "./" + config.storage.images.templates.path : "") + name
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
      captions.forEach((caption) => {
        console.log("the caption size is", caption.size)
        ctx.font = `bold ${caption.size}pt Arial`

        ctx.fillStyle = caption.color

        // write text
        const text = caption.text
        ctx.fillText(text, caption.position.x, caption.position.y)
      })
      resolve(canvas)
      return
    })
  }

  createMultiImageMemeCanvas(
    captions: ICaption[],
    images: IImage[],
    canvasDim?: ICanvas,
    fullpath?: boolean
  ): Promise<Canvas> {
    return new Promise(async (resolve, reject) => {
      const canvasWidth = canvasDim ? canvasDim.width : 0
      const cnavasHeight = canvasDim ? canvasDim.height : 0
      const canvas = createCanvas(canvasWidth, cnavasHeight)
      const ctx = canvas.getContext("2d")
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < images.length; i++) {
        let img: Image = new Image()
        try {
          img = await loadImage(
            (!fullpath ? "./" + config.storage.images.templates.path : "") +
              images[i].name
          )
        } catch (err) {
          reject(err)
          return
        }

        // draw image
        ctx.drawImage(
          img,
          images[i].position.x,
          images[i].position.y,
          images[i].width,
          images[i].height
        )
      }

      // for each caption write to file
      captions.forEach((caption) => {
        const fontStyle = caption.style ? caption.style : "normal"
        const fontWeight = caption.weight ? caption.weight : "700"
        ctx.font = `${fontStyle} ${fontWeight} ${caption.size}px Arial`
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
