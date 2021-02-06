export interface IVideoFrame {
  id?: any
  file: string
  route: string
}
export interface IFrameVector {
  frames: IVideoFrame[]
  fps: string
}

export interface IVideoTemplate {
  id?: any
  file: string
  route: string
  audio: string
  frames: IFrameVector
}

export interface IVideoTemplateModel {}
