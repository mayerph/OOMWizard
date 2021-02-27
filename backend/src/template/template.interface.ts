import { IOwned } from '../user/ownership'
/**
 * interface for a meme template
 */
export interface ITemplate extends IOwned{
  id?: any
  name: string
  route: string
  timestamp?: Date
}

export interface ITemplateModel {}
