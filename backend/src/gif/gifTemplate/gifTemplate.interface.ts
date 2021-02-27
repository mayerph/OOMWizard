import { IImageVector } from "../../imageVector/imageVector.interface"
import { IOwned } from '../../user/ownership'

export interface IGifTemplate extends IImageVector, IOwned {
  timestamp?: Date
}

export interface IGifTemplateModel {}
