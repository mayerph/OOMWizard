import * as fs from "fs"
import * as config from "../config.json"
import { Canvas, createCanvas, Image, loadImage } from "canvas"
import { IMeme } from "./meme.interface"
import { Meme } from "./meme.model"
import { Duplex } from "stream"
import * as uuid from "uuid"
import * as archiver from "archiver"
import { PassThrough } from "stream"

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
      // create filename
      const filename = this.createFilename()

      // create canvas
      const canvas = await this.createMemeCanvas(meme)

      // write meme to filesystem
      const filepath = await this.writeMemeToFile(canvas.toBuffer(), filename)

      const fullMeme = {
        name: filename,
        route: config.storage.memes.route + "/" + filename,
        template: meme.template,
        captions: meme.captions
      }

      // write meme to database
      const result = await new Meme(fullMeme).save()
      return fullMeme
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
      const canvas = await this.createMemeCanvas(meme)

      // write meme to filesystem
      if (toFS) {
        const filepath = await this.writeMemeToFile(canvas.toBuffer(), filename)
        // write to db
        if (toDB) {
          const fullMeme = {
            name: filename,
            route: config.storage.memes.route + "/" + filename,
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
      const filepath = "./" + config.storage.memes.path + filename
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
