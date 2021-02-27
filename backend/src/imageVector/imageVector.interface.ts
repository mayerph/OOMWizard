export interface IDelay {
  id?: any
  numerator: number
  denominator: number
}

export interface IFrame {
  id?: any
  delay: IDelay
  file: string
  left: number
  top: number
  route: string
}

export interface IImageVector {
  id?: any
  file: string
  route: string
  frames: IFrame[]
}

export interface ImageVectorModel {}
