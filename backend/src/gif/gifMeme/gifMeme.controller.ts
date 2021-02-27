import * as fs from "fs"
import { IGifMeme } from "./gifMeme.interface"
import { MemeController } from "../../meme/meme.controller"
import * as path from "path"
import * as gif from "gifEndecoder"
import * as config from "../../config.json"
import * as uuid from "uuid"
import { GifMeme } from "./gifMeme.model"

import { filter_accessible, is_accessible } from "../../user/ownership"
import { ViewsController } from "../../meta/views.controller"
const viewsController = new ViewsController()

export class GifMemeController {
  /**
   * meme controller for canvas funtionality
   */
  memeController: MemeController
  /**
   * constructor for GifMemeController
   * create a memeController object for the canvas functionality
   * creates all necessary directories
   */
  constructor() {
    GifMeme.deleteMany({}).exec()
    this.memeController = new MemeController(false)
    this.createNecessaryDirectories()
  }
  /**
   * returns a list of all gifMemes
   */
  async gifMemes(username?: String): Promise<IGifMeme[]> {
    return new Promise((resolve, reject) => {
      GifMeme.find()
        .then((gifMemes: IGifMeme[]) => {
          gifMemes = filter_accessible(gifMemes, false, username)
          for (var meme of gifMemes) {
            viewsController.notify_view(meme.id, username)
          }
          resolve(gifMemes)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * returns certain gif meme
   */
  async gifMeme(id: string, username?: string): Promise<IGifMeme | null> {
    return new Promise((resolve, reject) => {
      GifMeme.findById(id)
        .then((data) => {
          data = data && is_accessible(data, true, username) ? data : null
          if (data) {
            viewsController.notify_view(data.id, username)
          }
          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
  /**
   * creates all directories necessary for memes
   */
  createNecessaryDirectories(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const path1 = path.resolve(`./${config.storage.gifs.memes.path}/temp`)
      const path2 = path.resolve(`./${config.storage.gifs.memes.path}/result`)
      const paths = [path1, path2]
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
   * create and add new gif meme
   * @param meme metadata of the gif meme
   */
  async addGifMeme(
    meme: IGifMeme,
    owner?: String,
    access?: String
  ): Promise<any> {
    //console.log("the meme is", meme)
    return new Promise(async (resolve, reject) => {
      // create filepath to the modified frames
      const id = uuid.v4()
      const filepathToFrames = path.resolve(
        `./${config.storage.gifs.memes.path}/temp/${id}`
      )
      const result = await this.createDirectory(filepathToFrames)

      try {
        // wait until all files are written down to file system
        const modFrames = await this.writeFramesToFile(meme, filepathToFrames)
        const gifMeta = {
          file: "",
          frames: modFrames as any
        }
        // encode modified images to gif
        const destinationPath = path.resolve(
          `./${config.storage.gifs.memes.path}/result`
        )
        const newMeme = new GifMeme({
          file: "",
          route: "",
          timestamp: new Date(),
          owner: owner,
          access: access
        })
        const filename = `${newMeme.id}.gif`
        const filepath = `${destinationPath}/${filename}`

        const result = await this.encodeGif(gifMeta, filepath)

        newMeme.file = filepath
        newMeme.route = `${config.storage.gifs.memes.route}/result/${filename}`
        const final = await newMeme.save()

        // remove the saved files
        fs.rmdir(filepathToFrames, { recursive: true }, (err) => {})

        resolve(final)
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * encodes a gif file
   * @param gifMeta object containing all necessary gif information
   * @param filename name of the gif file
   */
  encodeGif(gifMeta: any, filename: string) {
    return new Promise((resolve, reject) => {
      gif.encodeGif(gifMeta, filename, true, 30, (err: any, result: any) => {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  /**
   * write all modified frames to the file system
   * @param meme object representing a meme
   * @param filepathToFrames path to the frames
   */
  writeFramesToFile(meme: IGifMeme, filepathToFrames: string) {
    return new Promise((resolve, reject) => {
      if (!meme.frames) {
        reject("missing frames attribute")
        return
      }
      const modFramesPromises = meme.frames.map(async (frame, index) => {
        return new Promise(async (resolve, reject) => {
          try {
            // create canvas with captions
            const canvas = await this.memeController.createMemeCanvas(
              frame.captions,
              frame.file,
              true
            )
            // filepath to the modified frames
            const frameFilePath = `${filepathToFrames}/${index}.png`
            const writeStream = fs.createWriteStream(frameFilePath)
            const dataUrl = canvas.toBuffer()
            const dataStream = this.memeController.bufferToStream(dataUrl)

            // write modified frames to file
            dataStream
              .pipe(writeStream)
              .on("close", () => {
                const newFrame = {
                  delay: frame.delay,
                  file: frameFilePath,
                  left: frame.left,
                  top: frame.top
                }

                resolve(newFrame)
                return
              })
              .on("error", (err) => {
                reject(err)
                return
              })
          } catch (err) {
            reject(err)
          }
        })
      })

      Promise.all(modFramesPromises)
        .then((data) => {
          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}
