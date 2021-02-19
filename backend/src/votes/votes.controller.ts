import { User } from "../user/user.model"
import { IVote, Like } from "./votes.model"

export class LikesController {

  async get_likes(meme_id: string){
    let likes = await Like.find({ meme_id: meme_id }).exec()
    return likes.length
  }

  async like(meme_id: string, username: string) {
    //TODO this is not threadsafe....
    //in our current version of MongoDb we cannot do this yet
    //except with unique indexes
    let present_like= await Like.findOne({
        meme_id: meme_id,
        username: username
      }).exec()

    if (!present_like){
      await new Like({ meme_id: meme_id, username: User }).save()
    }
    return await this.get_likes(meme_id)
  }

  async unlike(meme_id: string, username: string){
    await Like.findOneAndDelete({
      meme_id: meme_id,
      username: username,
    }).exec()
    return await this.get_likes(meme_id)
  }
}
