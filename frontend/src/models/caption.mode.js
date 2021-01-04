import { Position } from './position.model'

/**
 * represents a caption of meme
 */
export class Caption {
  /**
   * constructor for a caption object
   * @param {*} options json object representing a caption
   */
  constructor(options) {
    if (!options) {
      throw new Error('Caption: empty object')
    }
    // optional
    this.id = options.id ? options.id : undefined

    // mandatory
    if (!options.text) {
      throw new Error("Caption: missing property 'text'")
    }
    this.text = options.text

    if (!options.position) {
      throw new Error("Caption: missing property 'position'")
    }
    this.position = new Position(options.position)

    if (!options.color) {
      throw new Error("Caption: missing property 'color'")
    }
    this.position = options.color

    if (!options.size) {
      throw new Error("Caption: missing property 'size'")
    }
    this.position = options.size
  }

  /**
   * transfers an JSON object to a caption object
   * @param {*} options json object representing a caption
   */
  static fromJSON(options) {
    if (!options) {
      return null
    }
    return new Caption(options)
  }
}
