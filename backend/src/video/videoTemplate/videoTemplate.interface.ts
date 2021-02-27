import { IOwned } from "../../user/ownership";

export interface IVideoFrame {
  id?: any
  file: string
  route: string
}
export interface IFrameVector<T> {
  frames: T[]
  fps: string
}
export type IFrameVectorT = IFrameVector<IVideoFrame>
export interface IVideoTemplate extends IOwned {
  id?: any
  file: string
  route: string
  audio: string
  thumbnail: string
  frames?: IFrameVectorT
  timestamp?: Date
}

export interface IVideoTemplateModel {}
