import * as express from "express"
import { Router, Request, NextFunction, Response } from "express"
import { require_query_param } from "../utils"
import { Views, IViews } from "./views.model"

export class ViewsController {

  async notify_view(identifier: String, username?: String){
      if (username) {
        await Views.updateOne(
          { identifier: identifier, username: username },
          { timestamp: new Date() },
          { upsert: true }
        ).exec()
      }
  }

  async views(identifier?: string): Promise<number>{
    return await Views.countDocuments({ identifier: identifier }).exec()
  }

  async views_timeline(identifier?: string) : Promise<{timestamp: Date, views: number}[]> {
    let views: IViews[] = await Views.find({ identifier: identifier }).exec()
    let result = views.map((view, index) => {
      return { timestamp: view.timestamp, views: index + 1 }
    })
    return result
  }
}
