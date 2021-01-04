import { Template } from "./template.model"

/**
 * represents a meme
 */
export class Meme {

    constructor(options) {
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
}