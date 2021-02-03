import { IGifTemplate } from "../gifTemplate/gifTemplate.interface"
import { IPosition, ICaption } from "../../meme/meme.interface"
import { IFrame } from "../gifTemplate/gifTemplate.interface"

/**
 * Interface for the frames
 */
export interface IFrameExt extends IFrame {
  captions: ICaption[]
}
/**
 * Interface for a gifMeme
 */
export interface IGifMeme {
  id?: any
  file?: string
  route?: string
  frames?: IFrameExt[]
}

export interface IGifMemeModel {}