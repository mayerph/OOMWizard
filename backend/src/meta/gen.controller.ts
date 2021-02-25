import * as express from "express"
import { Router, Request, NextFunction, Response } from "express"
import { GeneratedMeme } from "./gen.model"

export class GeneratedMemesController {
  async notify_generated_meme(identifier: String) {
    await GeneratedMeme.updateOne(
      { identifier: identifier },
      { timestamp: new Date() },
      { upsert: true }
    ).exec()
  }

  async generated_memes(identifier?: string) {
    return await GeneratedMeme.countDocuments({ identifier: identifier }).exec()
  }

  async generated_memes_timeline(identifier?: string) {
    let gen = await GeneratedMeme.find({ identifier: identifier }).exec()
    let result = gen.map((view, index) => {
      return { timestamp: view.timestamp, generated_memes: index + 1 }
    })
    return result
  }
}
