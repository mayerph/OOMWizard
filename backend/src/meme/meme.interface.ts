import { IMemeTemplate } from "./memeTemplate.interface"

interface IPosition {
  x: number
  y: number
  z: number
}

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
