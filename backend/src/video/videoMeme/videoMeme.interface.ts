import {
  IVideoTemplate,
  IFrameVector
} from "../videoTemplate/videoTemplate.interface"
import { IPosition, ICaption } from "../../meme/meme.interface"
import { IVideoFrame } from "../videoTemplate/videoTemplate.interface"
import { IOwned } from '../../user/ownership'

/**
 * Interface for the frames
 */
export interface IVideoFrameExt extends IVideoFrame {
  captions: ICaption[]
}

export type IFrameVectorM = IFrameVector<IVideoFrameExt>
/**
 * Interface for a videoMeme
 */
export interface IVideoMeme extends IOwned{
  id?: any
  file?: string
  route?: string
  audio?: string
  frames?: IFrameVectorM
  timestamp?: Date
}

export interface IVideoMemeModel {}
