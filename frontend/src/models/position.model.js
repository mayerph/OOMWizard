/**
 * represents the position of a caption
 */
export class Position {
    constructor(options) {
        // optional 
        this.id = options.id ? options.id : undefined
        // mandatory
        if (!options.x) {
            throw new Error("Caption: missing property 'text'")
        }
        this.x = options.x

        if (!options.y) {
            throw new Error("Caption: missing property 'text'")
        }
        this.y = options.y
    }
}