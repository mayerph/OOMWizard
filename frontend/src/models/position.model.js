/**
 * represents the position of a caption
 */
export class Position {
  /**
   * constructor for a position object
   * @param {*} options json object representing a meme
   */
  constructor(options) {
    if (!options) {
      throw new Error('Position: empty object')
    }
    // optional
    this.id = options.id ? options.id : undefined
    // mandatory
    if (!options.x) {
      throw new Error("Position: missing property 'text'")
    }
    this.x = options.x

    if (!options.y) {
      throw new Error("Position: missing property 'text'")
    }
    this.y = options.y
  }

  /**
   * transfers an JSON object to a Position object
   * @param {*} options json object representing the position
   */
  static fromJSON(options) {
    if (!options) {
      return null
    }
    return new Position(options)
  }
}
