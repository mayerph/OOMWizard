import { IMemeTemplate } from "./memeTemplate.interface"

/**
 * Interface for the position
 */
interface IPosition {
  x: number
  y: number
  z: number
}

/**
 * Interface for a meme
 */
export interface IMeme extends IMemeTemplate {
  caption1?: {
    text: string
    position: IPosition
  }
  caption2?: {
    text: string
    position: IPosition
  }
}

export interface IMemeModel {}
