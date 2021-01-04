/**
 * represents a meme template
 */
export class Template {
  constructor(options) {
    // optional
    this.id = options.id ? options.id : undefined
    this.name = options.name ? options.name : undefined
    this.route = options.route ? options.route : undefined
  }
}
