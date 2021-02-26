import { ITemplate } from "../template/template.interface"

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

/**
 * Interface for a meme
 */
export interface IMeme {
  id?: any
  name?: string
  owner?: string
  access?: string
  timestamp?: Date
  route?: string
  captions: ICaption[]
  template: ITemplate
  is_accessible(show_unlisted: boolean, username?: String): boolean
}

export interface IMemeModel {}
