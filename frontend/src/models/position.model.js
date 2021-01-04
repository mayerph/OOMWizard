/**
 * represents the position of a caption
 */
export class Position {
    constructor(options) {
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