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
 * Interface for a meme
 */
export interface IMeme {
  id?: any
  name?: string
  route?: string
  captions: ICaption[]
  template: ITemplate
}

export interface IMemeModel {}
