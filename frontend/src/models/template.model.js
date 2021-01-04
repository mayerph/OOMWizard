/**
 * represents a meme template
 */
export class Template {
  /**
   * constructor for a template object
   * @param {*} options json object representing a meme template
   */
  constructor(options) {
    if (!options) {
      throw new Error('Template: empty object')
    }
    // optional
    this.id = options.id ? options.id : undefined
    this.name = options.name ? options.name : undefined
    this.route = options.route ? options.route : undefined
  }

  /**
   * transfers an JSON object to a Template object
   * @param {*} options json object representing a meme template
   */
  static fromJSON(options) {
    if (!options) {
      return null
    }
    return new Template(options)
  }
}
