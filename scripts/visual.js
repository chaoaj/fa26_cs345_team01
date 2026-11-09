/**
 * The draw function used by Visual
 *
 * @callback drawFn
 * @param {number[]} cols   team colors
 */

/**
 * Visual class. Stores a draw function and a shade value.
 * These objects allow us to keep track of what should be drawn for each object, and draw them
 * without needed to define a specific draw function for everything on the map. Draw functions
 * usually should accept the variables (x, y, cols) where x and y are center position and cols
 * are team colors. Team colors should be affected by the shade variable in the draw fn
 */
class Visual {
    /**
     * 
     * @param {drawFn} draw function to draw visual
     */
    constructor(draw) {
        this.draw = draw;
    }
}