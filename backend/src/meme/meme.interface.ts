import { ITemplate } from "../template/template.interface"
import { IOwned } from "../user/ownership"

/**
 * Interface for the position
 */
export interface IPosition {
  id?: any
  x: number
  y: number
}

/**
 * Interface for the caption
 */
export interface ICaption {
  id?: any
  text: string
  position: IPosition
  color: string
  style?: string
  weight?: string
  size: number
}
/**
 * Interface for images
 */
export interface IImage {
  id?: any
  name: string
  position: IPosition
  width: number
  height: number
}

export interface ICanvas {
  width: number
  height: number
}

/**
 * Interface for a meme
 */
export interface IMeme extends IOwned {
  id?: any
  name?: string
  timestamp?: Date
  route?: string
  captions: ICaption[]
  images?: IImage[]
  canvas?: ICanvas
  template: ITemplate
}

export interface IMemeModel {}
