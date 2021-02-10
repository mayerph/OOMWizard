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
export interface IVideoTemplate {
  id?: any
  file: string
  route: string
  audio: string
  frames: IFrameVectorT
}

export interface IVideoTemplateModel {}
