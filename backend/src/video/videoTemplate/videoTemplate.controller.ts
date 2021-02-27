import {
  IFrameVector,
  IFrameVectorT,
  IVideoFrame,
  IVideoTemplate
} from "./videoTemplate.interface"
import { VideoTemplate } from "./videoTemplate.model"
import * as fs from "fs"
import { promises as fsP } from "fs"

import * as uuid from "uuid"
import * as gif from "gifEndecoder"
import * as path from "path"
import * as config from "../../config.json"

import { filter_accessible, is_accessible } from "../../user/ownership"
import { exec } from "child_process"
import { IOwned } from "../../user/ownership"
import { ViewsController } from "../../meta/views.controller"
const viewsController = new ViewsController()

export class VideoTemplateController {
  audioFileName: string = "audio.wav"

  constructor() {
    VideoTemplate.deleteMany({}).exec()
    this.createNecessaryDirectories()
  }

  /**
   * creates all directories necessary for memes
   */
  createNecessaryDirectories(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const path1 = path.resolve(`${config.storage.videos.templates.path}`)
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
  async gifTemplates(username?: String): Promise<IVideoTemplate[]> {
    var gifTemplates: IVideoTemplate[] = await VideoTemplate.find()
    gifTemplates = filter_accessible(gifTemplates, false, username)
    for (var template of gifTemplates) {
      viewsController.notify_view(template.id, username)
    }
    return gifTemplates
  }

  /**
   * returns certain gif template
   */
  async gifTemplate(
    id: string,
    username?: String
  ): Promise<IVideoTemplate | null> {
    var gifTemplate = await VideoTemplate.findById(id)
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
  ): Promise<IVideoTemplate | null> {
    return new Promise(async (resolve, reject) => {
      // check if the sent object is of type memeTemplate
      if (!this.instanceOfVideoTemplate(object, true) && id != object.id) {
        reject("type error. Object of type gifTemplate is needed")
        return
      }

      // query for a template
      let gifTemplate = null
      try {
        gifTemplate = await VideoTemplate.findById(id)
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
   * check if object is of type VideoTemplate
   * @param object videoTemplate object
   * @param withId should the id property be considered
   */
  instanceOfVideoTemplate(
    object: any,
    withId?: boolean
  ): object is IVideoTemplate {
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
   * @param id videoTemplate id
   */
  async deleteVideoTemplate(id: string): Promise<IVideoTemplate> {
    return new Promise(async (resolve, reject) => {
      // query for a videoTemplate
      let videoTemplate = null
      try {
        videoTemplate = await VideoTemplate.findById(id)
      } catch (err) {
        reject(`no gifTemplate with id ${id} found`)
        return
      }
      // check if a videoTemplate has been found
      if (!videoTemplate) {
        reject(`no gifTemplate with id ${id} found`)
        return
      }
      // delete videoTemplate in storage
      const filepath = `${config.storage.videos.templates.path}/${videoTemplate.id}`

      if (fs.existsSync(filepath)) {
        fs.rmdirSync(filepath, { recursive: true })
      }

      // delete videoTemplate
      try {
        const result = await videoTemplate.deleteOne()
        resolve(videoTemplate)
        return
      } catch (err) {
        reject(`videoTemplate couldn't be updated`)
        return
      }
    })
  }

  /**
   * write image to file
   * @param video object with the image (meta)data
   */
  writeVideoTemplate(
    video: any,
    owner?: string,
    access?: string
  ): Promise<IVideoTemplate> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!video.data || !video.name) {
          reject(new Error("no image data"))
        }

        const videoTemplateDoc: IVideoTemplate = {
          file: "..",
          route: "..",
          audio: "..",
          timestamp: new Date(),
          frames: {
            frames: [],
            fps: ".."
          },
          thumbnail: "..",
          owner: owner,
          access: access
        }

        const videoTemplate = new VideoTemplate(videoTemplateDoc)

        // create directory for video template
        const filepath = `${config.storage.videos.templates.path}/${videoTemplate.id}`
        fs.mkdirSync(filepath)
        // create directory for frames
        const frameDstDirectory = filepath + "/frames"
        fs.mkdirSync(frameDstDirectory)

        // create directory for audio
        const audioDstDirectory = filepath + "/audio"
        fs.mkdirSync(audioDstDirectory)

        // create source
        const srcFile = filepath + `/${video.name}`
        fs.writeFileSync(srcFile, video.data)

        const frames = await this.decodeVideo(
          srcFile,
          frameDstDirectory,
          audioDstDirectory,
          videoTemplate.id
        )

        videoTemplate.frames = frames
        videoTemplate.audio = `${config.storage.videos.templates.path}/${videoTemplate.id}/audio/${this.audioFileName}`
        videoTemplate.file = video.name
        videoTemplate.route = `${config.storage.videos.templates.route}/${videoTemplate.id}/${video.name}`
        videoTemplate.thumbnail = frames.frames[0].route
        console.log(
          "videoTemplate.audio",
          videoTemplate.audio,
          config.storage.videos.templates.path
        )
        await videoTemplate.save()
        resolve(videoTemplate)
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

  writeVideo() {}

  /**
   * extracts audio, frames and fps from source video file
   * @param source source video file
   * @param frameDestination location where the frames should be stored
   * @param audioDestination location where the audio file should be stored
   */
  decodeVideo(
    source: string,
    frameDestination: string,
    audioDestination: string,
    id: string
  ): Promise<IFrameVectorT> {
    return new Promise((resolve, reject) => {
      // general information
      const sourcePath = path.resolve(source)
      const frameDestinationPath = path.resolve(frameDestination)
      const audioDestinationPath = path.resolve(audioDestination)
      // command-line commands
      const imageExtractionCmd = (amount: number) => {
        return `${config.ffmpeg.ffmpeg} -i "${sourcePath}" "${frameDestinationPath}/%0${amount}d.png"`
      }
      const audioExtractionCmd = `${config.ffmpeg.ffmpeg} -i "${sourcePath}" -vn "${audioDestinationPath}/${this.audioFileName}"`
      const metaInfoCmd = `${config.ffmpeg.ffprobe} -v error -select_streams v -of default=noprint_wrappers=1:nokey=1 -show_entries stream=r_frame_rate "${sourcePath}"`
      const countFramesCmd = `${config.ffmpeg.ffprobe} -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of default=nokey=1:noprint_wrappers=1 ${sourcePath}`

      const promises = []

      promises.push(
        new Promise((resolve, reject) => {
          exec(audioExtractionCmd, (err, data) => {
            if (err) reject(err)
            resolve(data)
          })
        })
      )
      promises.push(
        new Promise((resolve, reject) => {
          exec(countFramesCmd, (err, data) => {
            if (err) reject(err)
            resolve(data)
          })
        }).then((framesCount: any) => {
          return new Promise((resolve, reject) => {
            exec(
              imageExtractionCmd(
                (framesCount as string).replace("\n", "").length
              ),
              (err, data) => {
                if (err) reject(err)
                resolve(data)
              }
            )
          })
        })
      )
      Promise.all(promises)
        .then(() => {
          exec(metaInfoCmd, async (err, data) => {
            if (err) reject(err)
            try {
              const entries = await fsP.readdir(frameDestinationPath, {
                withFileTypes: true
              })
              const frames: IVideoFrame[] = []
              entries.forEach((elm) => {
                if (!elm.isDirectory()) {
                  frames.push({
                    file: `${config.storage.videos.templates.path}/${id}/frames/${elm.name}`,
                    route: `${config.storage.videos.templates.route}/${id}/frames/${elm.name}`
                  })
                }
              })

              resolve({ frames, fps: data.replace("\n", "") })
            } catch (err) {
              reject(err)
            }
          })
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}
