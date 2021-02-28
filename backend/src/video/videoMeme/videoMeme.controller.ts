import * as fs from "fs"
import { IVideoMeme } from "./videoMeme.interface"
import { MemeController } from "../../meme/meme.controller"
import * as path from "path"
import * as config from "../../config.json"
import * as uuid from "uuid"
import { VideoMeme } from "./videoMeme.model"
import { exec } from "child_process"

import { filter_accessible, is_accessible } from "../../user/ownership"
import { ViewsController } from "../../meta/views.controller"
const viewsController = new ViewsController()

export class VideoMemeController {
  memeController: MemeController
  constructor() {
    VideoMeme.deleteMany({}).exec()
    this.memeController = new MemeController(false)
    this.createNecessaryDirectories()
  }
  /**
   * returns a list of all videoMemes
   */
  async videoMemes(username?: String): Promise<IVideoMeme[]> {
    return new Promise((resolve, reject) => {
      VideoMeme.find()
        .then((videoMemes: IVideoMeme[]) => {
          videoMemes = filter_accessible(videoMemes, false, username)
          for (var meme of videoMemes) {
            viewsController.notify_view(meme.id, username)
          }
          resolve(videoMemes)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * returns certain video meme
   */
  async videoMeme(id: string, username?: String): Promise<IVideoMeme | null> {
    return new Promise((resolve, reject) => {
      VideoMeme.findById(id)
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
      const path1 = path.resolve(`${config.storage.videos.memes.path}/temp`)
      const path2 = path.resolve(`${config.storage.videos.memes.path}/result`)
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
   * create and add new video meme
   * @param meme metadata of the video meme
   */
  async addVideoMeme(
    meme: IVideoMeme,
    owner?: string,
    access?: string
  ): Promise<any> {
    //console.log("the meme is", meme)
    return new Promise(async (resolve, reject) => {
      try {
        // create filepath to the modified frames
        const id = uuid.v4()

        const pathToFrames = path.resolve(
          `${config.storage.videos.memes.path}/temp/${id}`
        )

        const pathToAudio = path.resolve(`${meme?.audio || ""}`)

        await this.createDirectory(pathToFrames)

        // wait until all files are written down to file system
        const modFrames = await this.writeFramesToFile(meme, pathToFrames)
        const videoMeta = {
          file: "",
          frames: modFrames as any,
          timestamp: new Date(),
          owner: owner,
          access: access
        }
        // encode modified images to video
        const destinationPath = path.resolve(
          `${config.storage.videos.memes.path}/result`
        )
        const newMeme = new VideoMeme({ file: "", route: "" })
        const filename = `${newMeme.id}.mp4`
        const pathToMeme = `${destinationPath}/${filename}`

        await this.encodeVideo(
          pathToFrames,
          pathToAudio,
          meme.frames?.fps || "",
          pathToMeme
        )

        newMeme.file = pathToMeme
        newMeme.route = `${config.storage.videos.memes.route}/result/${filename}`
        await newMeme.save()

        // remove the saved files
        fs.rmdir(pathToFrames, { recursive: true }, (err) => {})

        resolve(newMeme)
      } catch (err) {
        reject(err)
      }
    })
  }
  encodeVideo(
    framesSource: any,
    audioSource: string,
    fps: string,
    memeDestination: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // general information
      const framesSourcePath = path.resolve(framesSource)
      const audioSourcePath = path.resolve(audioSource)
      const memeDestinationPath = path.resolve(memeDestination)

      // command-line commands
      const decodeMemeCmd = `${config.ffmpeg.ffmpeg} -r ${fps} -i "${framesSourcePath}/%d.png" -i "${audioSourcePath}" -c:v libx264 -pix_fmt yuv420p  -crf 23 -r ${fps} -y ${memeDestinationPath}`

      const promises = []

      promises.push(
        new Promise((resolve, reject) => {
          exec(decodeMemeCmd, (err, data) => {
            if (err) reject(err)
            resolve(data)
          })
        })
      )

      Promise.all(promises).then(() => {
        resolve(true)
      })
    })
  }

  writeFramesToFile(meme: IVideoMeme, filepathToFrames: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!meme.frames) {
        reject("missing frames attribute")
        return
      }
      const modFramesPromises = meme.frames.frames.map(async (frame, index) => {
        return new Promise(async (resolve, reject) => {
          try {
            const frameSrcDirectory = path.resolve(`${frame.file}`)
            // create canvas with captions
            const canvas = await this.memeController.createMemeCanvas(
              frame.captions,
              frameSrcDirectory,
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
                  file: frameFilePath
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
