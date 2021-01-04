import { Position } from "./position.model"

/**
 * represents a caption of meme
 */
export class Caption {
    constructor(options) {
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
    
  }