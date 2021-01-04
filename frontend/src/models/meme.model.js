import { Template } from './template.model'

/**
 * represents a meme
 */
export class Meme {
  /**
   * constructor for a meme object
   * @param {*} options json object representing a meme
   */
  constructor(options) {
    if (!options) {
      throw new Error('Meme: empty object')
    }
    // optionals
    this.id = options.id ? options.id : undefined
    this.name = options.name ? options.name : undefined
    this.route = options.route ? options.route : undefined

    // mandatory
    if (!options.template) {
      throw new Error("Meme: missing property 'template'")
    }
    this.template = new Template(options.template)

    if (!options.captions) {
      throw new Error("Meme: missing property 'caption'")
    }

    this.captions = [].concat(options.captions)
  }

  /**
   * transfers an JSON object to a Meme object
   * @param {*} options json object representing a meme
   */
  static fromJSON(options) {
    if (!options) {
      return null
    }
    return new Meme(options)
  }
}
