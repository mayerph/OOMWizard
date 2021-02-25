import { IComment, Comment } from "./comments.model"
import { Meme } from "../meme/meme.model"
var xss = require("xss")

export class CommentsController {
  async comment(identifier: string, username: string, comment: string) {
    //prevent xss
    let escaped_comment = xss(comment)
    let com = new Comment({
      identifier: identifier,
      username: username,
      timestamp: Date.now(),
      comment: escaped_comment
    })
    await com.save()
  }

  async list_comments(identifier: string): Promise<IComment[]> {
    return await Comment.find({ identifier: identifier }).exec()
  }

  async nr_comments(identifier?: string) {
    return await Comment.countDocuments({ identifier: identifier }).exec()
  }
  async nr_comments_timeline(identifier?: string) {
    let comments = await Comment.find({ identifier: identifier }).exec()
    return comments.map((com, index) => {
      return { timestamp: com.timestamp, index }
    })
  }
}
