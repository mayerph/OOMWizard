import { IComment, Comment } from "./comments.model"
import { Meme} from "../meme/meme.model"
var xss = require("xss")

export class CommentsController {

  async comment(meme_id: string, username: string, comment: string) {
    let escaped_comment = xss(comment)
    //check whether meme_id exists
    if (!await Meme.findById(meme_id)){
      throw new Error(`Meme with id ${meme_id} does not exist`)
    }

    let com = new Comment({
      meme_id: meme_id,
      username: username,
      timestamp: Date.now(),
      comment: comment
    })
    await com.save()
  }

  async list_comments(meme_id: string): Promise<IComment[]>{
    let comments = await Comment.find({meme_id: meme_id}).exec()
    //FIXME this may be necessary but is borked right now to lazy to fix 
    //comments = comments.sort((a: IComment,b: IComment): boolean=> {
      //return a.timestamp <= b.timestamp
    //})
    return comments
  }
}
