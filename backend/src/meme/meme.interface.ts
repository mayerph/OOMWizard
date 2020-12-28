import { IMemeTemplate } from "./memeTemplate.interface"

/**
 * Interface for the position
 */
interface IPosition {
  x: number
  y: number
}

/**
 * Interface for the caption
 */
export interface ICaption {
  text: string
  position: IPosition
  color: string
  size: number
}

/**
 * Interface for a meme
 */
export interface IMeme extends IMemeTemplate {
  caption1?: ICaption
  caption2?: ICaption
}

export interface IMemeModel {}
