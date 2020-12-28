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
interface ICaption {
  text: string
  position: IPosition
  color?: "black" | "white"
  size?: 8 | 16 | 32 | 64 | 128
}

/**
 * Interface for a meme
 */
export interface IMeme extends IMemeTemplate {
  caption1?: ICaption
  caption2?: ICaption
}

export interface IMemeModel {}
