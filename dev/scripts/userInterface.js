// Global Variables
// Screen/Canvas Size
const RESOLUTIONS = [
    [800, 450],
    [960, 540],
    [1024, 576],
    [1152, 648],
    [1280, 720],
    [1366, 700], // Starting
    [1600, 900],
    [1920, 1080],
    [2560, 1440],
    [3840, 2160]
];

let RES_X = 1366;
let RES_Y = 700;

function resizeScreen(w = RES_X, h = RES_Y) {
    RES_X = w;
    RES_Y = h;
    minZoom = Math.max(
        RES_X / MAP_W,
        RES_Y / MAP_H
    );
    mode.resizeUI();
    resizeCanvas(w, h);
}

function increaseResolution() {
    const currentIndex = RESOLUTIONS.findIndex(
        ([w, h]) => w === RES_X && h === RES_Y
    );

    const nextIndex = Math.min(
        currentIndex + 1,
        RESOLUTIONS.length - 1
    );

    const [w, h] = RESOLUTIONS[nextIndex];
    resizeScreen(w, h);
}

function decreaseResolution() {
    const currentIndex = RESOLUTIONS.findIndex(
        ([w, h]) => w === RES_X && h === RES_Y
    );

    const nextIndex = Math.max(
        currentIndex - 1,
        0
    );

    const [w, h] = RESOLUTIONS[nextIndex];
    resizeScreen(w, h);
}

/**
 * Matches context expressions enclosed in square brackets, supporting property access,
 * function calls with no arguments, and optional property segments marked with '?'.
 * Examples: [name], [getName()], [user?.name], [user?.getName().firstName]
 */
const CONTEXT_REGEX =
    /\[((?:[A-Za-z_$][\w$]*\??)(?:\(\))?(?:\.[A-Za-z_$][\w$]*\??(?:\(\))?)*)?\]/g;

/**
 * A callback used for InterfaceElements
 *
 * @callback InterfaceFunction
 * @returns {boolean}
 */

/**
 * A callback used for InterfaceElements
 *
 * @callback AttributeFunction
 * @param {*}   context new data context
 * @returns {*}         interpreted context
 */

/**
 * Used to get values from dataContext
 *
 * @callback DataContextFunction
 * @param {Object} dataContext  dataContext
 * @returns                     requested value
 */

/**
 * Represents a single ui element
 */
class InterfaceElement {

    /**
     * Constructor
     * @param {number} x            x position (relative to parent)
     * @param {number} y            y position (relative to parent)
     * @param {number} w            width
     * @param {number} h            height
     * @param {InterfaceFunction} visible  function used to decide if the element is visible
     * @param {InterfaceFunction} enabled  function used to decide if the element is enabled to be clicked
     * @param {InterfaceFunction} onClick  function run when element is clicked
     */
    constructor(x, y, w, h, visible = () => true, enabled = () => true, onClick = () => true) {
        this.pos = new Position(x, y);
        this.w = w;
        this.h = h;
        this.visible = visible;
        this.enabled = enabled;
        this.onClick = onClick;
        this.children = [];
        this.parent = null;
        this.context = null;
        this.attribute = (context) => context;
        this.bgColor = [50];
        this.bgColorBase = [50];
        this.hvrBgColor = [70];
        this.hvrBgColorBase = [70];
    }

    /**
     * Absolute position of self, accounting for parent elements as well
     */
    get aPos() {
        let element = this;
        let position = new Position(0, 0);
        while (element) {
            position.addTo(element.pos);
            element = element.parent;
        }
        return position;
    }

    /**
     * Get own dataContext or that of parent
     */
    get dataContext() {
        if (this.context !== null)
            return this.context;
        if (this.parent)
            return this.parent.dataContext;
        return null;
    }

    /**
     * Returns true if this is the lowest level element being hovered on,
     * meaning no children of it are being hovered
     */
    get hovered() {
        const val = this.anyHovered;
        if (val) {
            for (const child of this.children) {
                if (child.anyHovered) {
                    return false;
                }
            }
        }
        return val;
    }

    /**
     * Returns true if self is hovered over, regardless of children
     */
    get anyHovered() {
        if (!this.visible())
            return false;
        const aPos = this.aPos;
        return mouseX >= aPos.x && mouseX <= aPos.x + this.w
            && mouseY >= aPos.y && mouseY <= aPos.y + this.h;
    }

    /**
     * Set own dataContext
     * @param {Object} context new context
     */
    setDataContext(context) {
        if (context === null) this.context = context;
        else this.context = this.attribute(context);
        if (this.updates) this.baseContext = context;

        for (const child of this.children) {
            child.setDataContext(this.context);
        }
        if (typeof this.bgColorBase === "string") {
            this.bgColor = resolveContextValue(this.dataContext, this.bgColorBase);
        }
        if (typeof this.hvrBgColorBase === "string") {
            this.hvrBgColor = resolveContextValue(this.dataContext, this.hvrBgColorBase);
        }

        return this;
    }

    /**
     * Click self
     * @returns {boolean}   if self or child was clicked
     */
    click() {
        if (!this.anyHovered)
            return false;
        if (!this.enabled())
            return false;
        let click = false;
        for (const child of this.children) {
            click = child.click();
            if (click)
                return true;
        }
        this.onClick();
        return true;
    }

    /**
     * Add a child element
     * @param {InterfaceElement} child 
     */
    addChild(child) {
        this.children.push(child);
        child.parent = this;
    }

    /**
     * Draw Interface element
     */
    draw() {
        if (!this.visible())
            return;
        if (this.updates)
            this.setDataContext(this.baseContext);
        push();
        translate(this.pos.x, this.pos.y);
        if (this.anyHovered)
            fill(...this.hvrBgColor);
        else
            fill(...this.bgColor);
        strokeWeight(0);
        rect(0, 0, this.w, this.h);
        for (const child of this.children) {
            child.draw();
        }
        pop();
    }

    /**
     * Is this child of element?
     * @param {InterfaceElement} element    element comparing to
     * @returns {boolean}                   if child/tree child of element 
     */
    childOf(element) {
        if (this === element)
            return true;
        if (!this.parent)
            return false;
        return this.parent.childOf(element);
    }
}

/**
 * Represents a line, either horizontal or vertical
 */
class InterfaceLine extends InterfaceElement {

    /**
     * Constructor
     * @param {number} x                    x position (relative to parent), centered
     * @param {number} y                    y position (relative to parent), centered
     * @param {number} w                    width (1-2 if horizontal)
     * @param {number} h                    height (1-2 if vertical)
     * @param {InterfaceFunction} visible   function used to decide if the element is visible
     */
    constructor(x, y, w, h, visible = () => true) {
        super(x, y, w, h, visible);
    }

    /**
     * Absolute position of self, accounting for parent elements as well
     */
    get aPos() {
        let element = this;
        let position = new Position(-this.w / 2, -this.h / 2);
        while (element) {
            position.addTo(element.pos);
            element = element.parent;
        }
        return position;
    }

    /**
     * Set own dataContext
     * @param {Object} context new context
     */
    setDataContext(context) {
        this.context = null;
        return this;
    }

    /**
     * Click self
     * @returns {boolean}   if self or child was clicked
     */
    click() {
        return false;
    }

    /**
     * Add a child element
     * @param {InterfaceElement} child 
     */
    addChild(child) {
        this.children.push(child);
        child.parent = this;
    }

    /**
     * Draw Interface element
     */
    draw() {
        if (!this.visible())
            return;
        push();
        translate(this.pos.x - this.w / 2, this.pos.y - this.h / 2);
        fill(...this.bgColor);
        strokeWeight(0);
        rect(0, 0, this.w, this.h);
        pop();
    }

    /**
     * Is this child of element?
     * @param {InterfaceElement} element    element comparing to
     * @returns {boolean}                   if child/tree child of element 
     */
    childOf(element) {
        if (this === element)
            return true;
        if (!this.parent)
            return false;
        return this.parent.childOf(element);
    }
}

/**
 * Represents a tooltip
 */
class InterfaceTooltip extends InterfaceElement {
    /**
     * Line of text
     * @typedef {Object} Line
     * @property {string} text      text
     * @property {number[]} colors  color of text
     */

    /**
     * Constructor
     * @param {InterfaceElement} origin InterfaceTooltip is shown if origin is hovered over
     * @param {string} [header=""]      Header text, bolded
     * @param {Line[]} [text=[]]        Lines of text
     * @param {number} [maxWidth=500]   Max width
     * @param {number} [fontSize=12]    Font size
     */
    constructor(origin, header = "", text = [], maxWidth = 500, fontSize = 12) {
        const aPos = origin.aPos;
        super(aPos.x, aPos.y, 0, 0, () => origin.anyHovered);
        this.baseY = aPos.y;
        mode.tooltips.add(this);
        this.origin = origin;
        this.header = header;
        this.lines = text;
        this.fontSize = fontSize;
        this.baseMaxWidth = maxWidth;
        this.maxWidth = Math.min(maxWidth, RES_X - aPos.x);
        this.updateText();
    }

    /**
     * Clicking tooltip does nothing
     * @returns {boolean} always false
     */
    click() {
        return false;
    }

    draw() {
        if (!this.visible())
            return;
        this.updatePosition();
        push();
        translate(Math.min(this.pos.x, RES_X - this.w), this.pos.y);
        let y = this.fontSize;
        fill(...this.bgColor)
        rect(0, 0, this.w, this.h);
        strokeWeight(0);
        textSize(this.fontSize);
        textAlign(LEFT, TOP);
        for (const line of this.calcText) {
            textStyle(line.bold ? BOLD : NORMAL);
            fill(...line.colors);
            text(line.text, this.fontSize, y);
            y += line.height;
        }
        pop();
    }

    /**
     * Correct own position
     */
    updatePosition() {
        const aPos = this.origin.aPos;
        this.maxWidth = Math.min(this.baseMaxWidth, RES_X - aPos.x);
        this.pos.x = aPos.x;
        this.pos.y = Math.max(0, aPos.y - this.h);
    }

    /**
     * Correct own text
     */
    updateText() {
        this.calcText = [];
        const padding = this.fontSize;
        textSize(this.fontSize);
        // Calculate width
        // Calculate natural text width
        let naturalWidth = 0;
        const calcHeader = this.header.replace(
            CONTEXT_REGEX,
            (match, id = "") => resolveContextValue(this.dataContext, id)
        );
        const newLines = this.lines.flatMap(line => {
            const text = line.text.replace(
                CONTEXT_REGEX,
                (match, id = "") => resolveContextValue(this.dataContext, id)
            );

            return text.split(/\r?\n/).map(text => ({
                ...line,
                text
            }));
        });
        textStyle(BOLD);
        if (calcHeader !== "")
            naturalWidth = textWidth(calcHeader);

        textStyle(NORMAL);
        for (const line of newLines)
            naturalWidth = Math.max(naturalWidth, textWidth(line.text));

        // Determine the maximum width available on screen
        const aPos = this.origin.aPos;
        const availableWidth = Math.max(
            2 * padding,
            Math.min(this.baseMaxWidth, RES_X - Math.max(0, aPos.x))
        );

        this.maxWidth = availableWidth;
        this.w = Math.min(availableWidth, naturalWidth + 2 * padding);

        const textWidthMax = this.w - 2 * padding;

        // Header
        if (this.calcHeader !== "") {
            for (const line of wrap(calcHeader, this.fontSize, BOLD, textWidthMax)) {
                this.calcText.push({
                    text: line,
                    colors: [255],
                    bold: true,
                    height: this.fontSize
                });
            }
        }

        // Body
        for (const line of newLines) {
            for (const wrapped of wrap(line.text, this.fontSize, NORMAL, textWidthMax)) {
                this.calcText.push({
                    text: wrapped,
                    colors: line.colors,
                    bold: false,
                    height: this.fontSize
                });
            }
        }

        this.h = padding * 2;

        for (const line of this.calcText)
            this.h += line.height;
    }

    /**
     * Set own dataContext
     * @param {Object} context new context
     */
    setDataContext(context) {
        if (context === null) this.context = context;
        else this.context = this.attribute(context);

        for (const child of this.children) {
            child.setDataContext(this.context);
        }
        if (typeof this.bgColorBase === "string") {
            this.bgColor = resolveContextValue(this.dataContext, this.bgColorBase);
        }
        if (typeof this.hvrBgColorBase === "string") {
            this.hvrBgColor = resolveContextValue(this.dataContext, this.hvrBgColorBase);
        }
        this.updatePosition();
        this.updateText();
        return this;
    }
}

/**
 * Represents a troop button
 */
class InterfaceTroopButton extends InterfaceElement {
    /**
     * Constructor
     * @param {TroopBase} context           troop being depicted
     * @param {number} x                    x position (relative to parent)
     * @param {number} y                    y position (relative to parent)
     * @param {number} [scale=1]            scale, used to determine size. 1.0 is 60 x 60
     * @param {boolean} [outline=true]      does it have an outline?
     * @param {boolean} [tooltip=true]      does it have a tooltip?
     * @param {InterfaceFunction} visible   function used to decide if the element is visible
     * @param {InterfaceFunction} enabled   function used to decide if the element is enabled to be clicked
     * @param {InterfaceFunction} onClick   function run when element is clicked
     */
    constructor(context, x, y, scale = 1, outline = true, tooltip = true, visible = () => true, enabled = () => true, onClick = () => true) {
        super(x, y, 60 * scale, 60 * scale, visible, enabled, onClick);
        this.context = context;
        this.scale = scale;
        this.outline = outline;
        if (tooltip)
            this.tooltip = new InterfaceTooltip(this, "[name]", [], this.scale * 300, this.scale * 12);
    }

    draw() {
        if (!this.visible())
            return;
        const cols = this.enabled() ? liveCols : deadCols;
        push();
        translate(this.pos.x, this.pos.y);
        scale(this.scale);
        drawingContext.save();
        drawingContext.beginPath();
        drawingContext.rect(0, 0, 60, 60);
        drawingContext.clip();

        if (this.outline) {
            stroke(...cols);
            strokeWeight(4);
        }
        else {
            strokeWeight(0);
        }
        fill(...this.bgColor);
        // Gets cut-off if (0, 0, 60, 60)
        rect(2, 2, 56, 56);
        this.dataContext.drawBase(30, 30, cols);
        drawingContext.restore();
        pop();
    }

    /**
     * Set own dataContext
     * @param {Object} context new context
     */
    setDataContext(context) {
        if (context === null) this.context = context;
        else this.context = this.attribute(context);

        for (const child of this.children) {
            child.setDataContext(this.context);
        }
        if (typeof this.bgColorBase === "string") {
            this.bgColor = resolveContextValue(this.dataContext, this.bgColorBase);
        }
        if (typeof this.hvrBgColorBase === "string") {
            this.hvrBgColor = resolveContextValue(this.dataContext, this.hvrBgColorBase);
        }
        if (this.tooltip) {
            this.tooltip.lines = [];
            for (const pro of this.context.pros) {
                this.tooltip.lines.push({
                    text: `+ ${pro.text}`,
                    colors: [180, 255, 180]
                });
            }
            for (const con of this.context.cons) {
                this.tooltip.lines.push({
                    text: `− ${con.text}`,
                    colors: [255, 180, 180]
                });
            }
            this.tooltip.lines.push({
                text: `Cost: ${this.context?.cost}`,
                colors: 'currency' in mode && mode.currency < this.context?.cost ? [255, 180, 180] : [255]
            });
            this.tooltip.setDataContext(this.context);
        }
        return this;
    }
}

/**
 * Represents a window. DataContext can be an object of any given type,
 * and children and it can access elements of it when drawing.
 */
class InterfaceWindow extends InterfaceElement {
    /**
     * Constructor
     * @param {Object} dataContext  data context
     * @param {number} x            x position (relative to parent)
     * @param {number} y            y position (relative to parent)
     * @param {number} w            width
     * @param {number} h            height
     * @param {number} padding      padding
     * @param {number} spacing      element spacing
     * @param {InterfaceFunction} visible  function used to decide if the element is visible
     * @param {InterfaceFunction} enabled  function used to decide if the element is enabled to be clicked
     * @param {InterfaceFunction} onClick  function run when element is clicked
     */
    constructor(dataContext, x, y, w, h, padding, spacing, visible = () => { this.context !== null }, enabled = () => true, onClick = () => true) {
        super(x, y, w, h, visible, enabled, onClick);
        this.baseY = y;
        this.minHeight = h;
        this.padding = padding;
        this.spacing = spacing;
        this.context = dataContext;
    }

    setDataContext(context) {
        if (context === null) this.context = context;
        else this.context = this.attribute(context);
        if (this.updates) this.baseContext = context;

        let y = this.padding;
        for (const child of this.children) {
            child.setDataContext(this.context);
            child.pos.y = y;
            if (child.block && child.visible())
                y += child.h + (child.padded ? this.spacing : 0);
        }
        this.h = Math.max(y + this.padding - (this.children.at(-1)?.block ? this.spacing : 0), this.minHeight);
        this.pos.y = this.baseY - this.h / 2;
        if (typeof this.bgColorBase === "string") {
            this.bgColor = resolveContextValue(this.dataContext, this.bgColorBase);
        }
        if (typeof this.hvrBgColorBase === "string") {
            this.hvrBgColor = resolveContextValue(this.dataContext, this.hvrBgColorBase);
        }

        return this;
    }
}

/**
 * Represents a container that arranges children in a single row, regardless of x/y position
 */
class InterfaceHBox extends InterfaceWindow {
    /**
     * Constructor
     * @param {Object} dataContext  data context
     * @param {number} x            x position (relative to parent)
     * @param {number} y            y position (relative to parent)
     * @param {number} w            width
     * @param {number} h            height
     * @param {number} padding      padding
     * @param {number} spacing      element spacing
     * @param {InterfaceFunction} visible  function used to decide if the element is visible
     * @param {InterfaceFunction} enabled  function used to decide if the element is enabled to be clicked
     * @param {InterfaceFunction} onClick  function run when element is clicked
     */
    constructor(dataContext, x, y, w, h, padding, spacing, visible = () => { this.context !== null }, enabled = () => true, onClick = () => true) {
        super(dataContext, x, y, w, h, padding, spacing, visible, enabled, onClick);
        this.baseX = x;
        this.minWidth = w;
    }

    setDataContext(context) {
        if (context === null) this.context = context;
        else this.context = this.attribute(context);
        if (this.updates) this.baseContext = context;

        let x = this.padding;
        for (const child of this.children) {
            child.setDataContext(this.context);
            child.pos.x = x;
            if (child instanceof InterfaceButton) {
                child.pos.x += child.w / 2;
            }
            if (child.block && child.visible()) {
                x += child.w + (child.padded ? this.spacing : 0);
            }
        }
        this.w = Math.max(x + this.padding - (this.children.at(-1)?.block ? this.spacing : 0), this.minWidth);
        this.pos.x = this.baseX - this.w / 2;
        if (typeof this.bgColorBase === "string") {
            this.bgColor = resolveContextValue(this.dataContext, this.bgColorBase);
        }
        if (typeof this.hvrBgColorBase === "string") {
            this.hvrBgColor = resolveContextValue(this.dataContext, this.hvrBgColorBase);
        }

        return this;
    }
}

/**
 * Represents a container that arranges children in a single column, regardless of x/y position
 */
class InterfaceVBox extends InterfaceWindow {
    /**
     * Constructor
     * @param {Object} dataContext  data context
     * @param {number} x            x position (relative to parent)
     * @param {number} y            y position (relative to parent)
     * @param {number} w            width
     * @param {number} h            height
     * @param {number} padding      padding
     * @param {number} spacing      element spacing
     * @param {InterfaceFunction} visible  function used to decide if the element is visible
     * @param {InterfaceFunction} enabled  function used to decide if the element is enabled to be clicked
     * @param {InterfaceFunction} onClick  function run when element is clicked
     */
    constructor(dataContext, x, y, w, h, padding, spacing, visible = () => { this.context !== null }, enabled = () => true, onClick = () => true) {
        super(dataContext, x, y, w, h, padding, spacing, visible, enabled, onClick);
        this.minHeight = h;
    }

    setDataContext(context) {
        if (context === null) this.context = context;
        else this.context = this.attribute(context);
        if (this.updates) this.baseContext = context;
        
        let y = this.padding;
        // let w = this.w;
        for (const child of this.children) {
            child.setDataContext(this.context);
            child.pos.y = y;
            if (child.block) {
                y += child.h + (child.padded ? this.spacing : 0);
            }
            // w = Math.max(w, child.pos.x + child.w);
        }
        // this.w = w;
        this.h = Math.max(y + this.padding - (this.children.at(-1)?.block ? this.spacing : 0), this.minHeight);
        if (typeof this.bgColorBase === "string") {
            this.bgColor = resolveContextValue(this.dataContext, this.bgColorBase);
        }
        if (typeof this.hvrBgColorBase === "string") {
            this.hvrBgColor = resolveContextValue(this.dataContext, this.hvrBgColorBase);
        }
        return this;
    }
}

/**
 * Text
 */
class InterfaceText extends InterfaceElement {
    /**
     * Constructor
     * @param {string} baseText                     text. Use "[VAL]" to get dataContext.val,
     *                                              while "[]" gets dataContext itself, and something like [fn().name] gets
     *                                              dataContext.fn().name
     * @param {number} x                            x position (relative to parent)
     * @param {number} y                            y position (relative to parent)
     * @param {number} [w=0]                        min width
     * @param {number} [h=0]                        min height
     * @param {number} [maxWidth=-1]                max width for wrapping. -1 means no wrap
     * @param {LEFT|CENTER|RIGHT} [align=LEFT]      text align 
     * @param {NORMAL|BOLD|ITALIC} [style=NORMAL]   text style
     * @param {number} [size=12]                    font size
     * @param {number[]} [colors=[255, 255, 255, 255]] font color
     * @param {InterfaceFunction} visible                  function used to decide if the element is visible
     * @param {InterfaceFunction} enabled                  function used to decide if the element is enabled to be clicked
     * @param {InterfaceFunction} onClick                  function used to decide if the element is visible
     */
    constructor(baseText, x, y, w = 0, h = 0, maxWidth = -1, align = LEFT, style = NORMAL, size = 12, colors = [255, 255, 255, 255], visible = () => true, enabled = () => true, onClick = () => true) {
        super(x, y, w, size, visible, enabled, onClick);
        this.baseX = x;
        this.baseH = h;
        this.baseW = w;
        this.baseText = baseText;
        this.maxWidth = maxWidth;
        this.align = align;
        this.style = style;
        this.size = size;
        this.colors = colors;
        textSize(this.size);
        textStyle(this.style);
        this.updateText();
    }

    /**
     * Get calculated text
     */
    get text() {
        const text = this.baseText.replace(
            CONTEXT_REGEX,
            (match, id = "") => resolveContextValue(this.dataContext, id)
        );
        return wrap(text, this.size, this.style, this.maxWidth);
    }

    /**
     * Update own text
     */
    updateText() {
        this.calcText = this.text;
        let naturalWidth = 0;
        textSize(this.size);
        textStyle(this.style);
        for (const line of this.calcText)
            naturalWidth = Math.max(naturalWidth, textWidth(line));
        this.w = Math.max((this.maxWidth > 0 ? Math.min(naturalWidth, this.maxWidth) : naturalWidth), this.baseW);
        this.h = Math.max(this.calcText.length * this.size, this.baseH);
        this.diff = Math.max((this.baseH - this.calcText.length * this.size) / 2, 0);
        if (this.align == RIGHT) {
            this.pos.x = this.baseX - this.w;
        } else if (this.align == CENTER) {
            this.pos.x = this.baseX - (this.w / 2);
        }
    }

    setDataContext(context) {
        if (context === null) this.context = context;
        else this.context = this.attribute(context);
        if (this.updates) this.baseContext = context;
        this.updateText();
        for (const child of this.children) {
            child.setDataContext(this.context);
        }
        return this;
    }

    draw() {
        if (!this.visible())
            return;
        if (this.updates)
            this.setDataContext(this.baseContext);
        push();
        switch (this.align) {
            case CENTER:
                translate(this.pos.x + (this.w / 2), this.pos.y + this.diff);
                break;
            case RIGHT:
                translate(this.pos.x + this.w, this.pos.y + this.diff);
                break;
            case LEFT:
            default:
                translate(this.pos.x, this.pos.y + this.diff);
                break;
        }
        fill(...this.colors);
        strokeWeight(0);
        textSize(this.size);
        textAlign(this.align, TOP);
        textStyle(this.style);
        let y = 0;
        for (const line of this.calcText) {
            text(line, 0, y);
            y += this.size;
        }
        pop();
    }
}

/**
 * Text w/ tooltip
 */
class InterfaceTooltipText extends InterfaceText {
    /**
     * Constructor
     * @param {string} baseText                     text. Use "[VAL]" to get dataContext.val,
     *                                              while "[]" gets dataContext itself, and something like [fn().name] gets
     *                                              dataContext.fn().name
     * @param {string} header                       tooltip header
     * @param {Line[]} lines                        tooltip text
     * @param {number} x                            x position (relative to parent)
     * @param {number} y                            y position (relative to parent)
     * @param {number} [w=0]                        min width
     * @param {number} [h=0]                        min height
     * @param {number} [maxWidth=-1]                max width for wrapping. -1 means no wrap
     * @param {LEFT|CENTER|RIGHT} [align=LEFT]      text align 
     * @param {NORMAL|BOLD|ITALIC} [style=NORMAL]   text style
     * @param {number} [size=12]                    font size
     * @param {number[]} [colors=[255, 255, 255, 255]] font color
     * @param {InterfaceFunction} visible                  function used to decide if the element is visible
     * @param {InterfaceFunction} enabled                  function used to decide if the element is enabled to be clicked
     * @param {InterfaceFunction} onClick                  function used to decide if the element is visible
     */
    constructor(baseText, header, lines, x, y, w = 0, h = 0, maxWidth = -1, align = LEFT, style = NORMAL, size = 12, colors = [255, 255, 255, 255], visible = () => true, enabled = () => true, onClick = () => true) {
        super(baseText, x, y, w, h, maxWidth, align, style, size, colors, visible, enabled, onClick);
        this.tooltip = new InterfaceTooltip(this, header, lines, maxWidth > 0 ? maxWidth * 2 : 200, size);
    }

    setDataContext(context) {
        if (context === null) this.context = context;
        else this.context = this.attribute(context);

        this.updateText();
        for (const child of this.children) {
            child.setDataContext(this.context);
        }
        this.tooltip.setDataContext(this.context);
        return this;
    }
}

/**
 * Button
 */
class InterfaceButton extends InterfaceElement {
    /**
     * Constructor
     * @param {string} baseText                     text. Use "[VAL]" to get dataContext.val,
     *                                              while "[]" gets dataContext itself, and something like [fn().name] gets
     *                                              dataContext.fn().name
     * @param {number} x                            x position (relative to parent)
     * @param {number} y                            y position (relative to parent)
     * @param {number} w                            width
     * @param {number} h                            height
     * @param {NORMAL|BOLD|ITALIC} [style=NORMAL]   text style
     * @param {number} [size=12]                    font size
     * @param {number[]} [colors=[255, 255, 255, 255]] font color
     * @param {InterfaceFunction} visible                  function used to decide if the element is visible
     * @param {InterfaceFunction} enabled                  function used to decide if the element is enabled to be clicked
     * @param {InterfaceFunction} onClick                  function used to decide if the element is visible
     */
    constructor(baseText, x, y, w, h, style = NORMAL, size = 12, colors = [255, 255, 255, 255], visible = () => true, enabled = () => true, onClick = () => true) {
        super(x, y, w, h, visible, enabled, onClick);
        this.baseText = baseText;
        this.style = style;
        this.size = size;
        this.colors = colors;
        textSize(this.size);
        textStyle(this.style);
        this.updateText();
    }

    get anyHovered() {
        if (!this.visible())
            return false;
        const aPos = this.aPos;
        return mouseX >= aPos.x && mouseX <= aPos.x + this.w
            && mouseY >= aPos.y && mouseY <= aPos.y + this.h;
    }

    get aPos() {
        let element = this;
        let position = new Position(-this.w / 2, 0);
        while (element) {
            position.addTo(element.pos);
            element = element.parent;
        }
        return position;
    }

    /**
     * Get calculated text
     */
    get text() {
        return this.baseText.replace(
            CONTEXT_REGEX,
            (match, id = "") => resolveContextValue(this.dataContext, id)
        );
    }

    /**
     * Update own text
     */
    updateText() {
        this.calcText = this.text;
    }

    setDataContext(context) {
        if (context === null) this.context = context;
        else this.context = this.attribute(context);
        if (this.updates) this.baseContext = context;
        if (typeof this.bgColorBase === "string") {
            this.bgColor = resolveContextValue(this.dataContext, this.bgColorBase);
        }
        if (typeof this.hvrBgColorBase === "string") {
            this.hvrBgColor = resolveContextValue(this.dataContext, this.hvrBgColorBase);
        }
        this.updateText();
        for (const child of this.children) {
            child.setDataContext(this.context);
        }
        return this;
    }

    draw() {
        if (!this.visible())
            return;
        if (this.updates)
            this.setDataContext(this.baseContext);
        push();
        translate(this.pos.x - this.w / 2, this.pos.y);
        strokeWeight(0);
        if (this.anyHovered && this.enabled())
            fill(...this.hvrBgColor);
        else
            fill(...this.bgColor);
        rect(0, 0, this.w, this.h);
        fill(...this.colors);
        textSize(this.size);
        textAlign(CENTER, CENTER);
        textStyle(this.style);
        text(this.calcText, this.w / 2, this.h / 2);
        pop();
    }
}

/**
 * Text
 */
class InterfaceMenuButton extends InterfaceButton {
    /**
     * Constructor
     * @param {string} baseText                     text. Use "[VAL]" to get dataContext.val,
     *                                              while "[]" gets dataContext itself, and something like [fn().name] gets
     *                                              dataContext.fn().name
     * @param {number} x                            x position (relative to parent)
     * @param {number} y                            y position (relative to parent)
     * @param {InterfaceFunction} visible                  function used to decide if the element is visible
     * @param {InterfaceFunction} enabled                  function used to decide if the element is enabled to be clicked
     * @param {InterfaceFunction} onClick                  function used to decide if the element is visible
     */
    constructor(baseText, x, y, visible = () => true, enabled = () => true, onClick = () => true) {
        super(baseText, x, y, 800, 80, BOLD, 40, [255], visible, enabled, onClick);
    }

    /**
     * Returns true if self is hovered over, regardless of children
     */
    get anyHovered() {
        if (!this.visible())
            return false;
        const aPos = this.aPos;
        return mouseX >= aPos.x + ((mouseY - aPos.y) / 2) && mouseX <= aPos.x + this.w - ((this.h + aPos.y - mouseY) / 2)
            && mouseY >= aPos.y && mouseY <= aPos.y + this.h;
    }

    draw() {
        if (!this.visible())
            return;
        push();
        translate(this.pos.x - (this.w / 2), this.pos.y);
        strokeWeight(0);
        if (this.anyHovered)
            fill(...this.hvrBgColor);
        else
            fill(...this.bgColor);
        beginShape();
        vertex(0, 0);
        vertex(this.h / 2, this.h);
        vertex(this.w, this.h);
        vertex(this.w - this.h / 2, 0);
        endShape(CLOSE);

        fill(...this.colors);
        textSize(this.size);
        textAlign(CENTER, CENTER);
        textStyle(this.style);
        text(this.calcText, this.w / 2, this.h / 2);
        pop();
    }
}

/**
 * Represents a list
 */
class InterfaceList extends InterfaceElement {

    /**
     * Used to create Interface List
     *
     * @callback ListFN
     * @param {*} context   dataContext
     * @param {number} X    x position
     * @param {number} y    y position
     * @returns {InterfaceElement} new element
     */

    /**
     * Constructor
     * @param {AttributeFunction} attribute what attribute to get 
     * @param {number} x                    x position (relative to parent)
     * @param {number} y                    y position (relative to parent)
     * @param {number} w                    width
     * @param {number} h                    height
     * @param {number} spacing              spacing between objects
     * @param {ListFN[]} baseChildren       children are built using this
     * @param {boolean} direction           if a vertical list, true. if horizontal, false
     * @param {InterfaceFunction} visible   function used to decide if the element is visible
     * @param {InterfaceFunction} enabled   function used to decide if the element is enabled to be clicked
     * @param {InterfaceFunction} onClick   function run when element is clicked
     */
    constructor(attribute, x, y, w, h, spacing, baseChildren = [(context, x, y) => { return new InterfaceText('[]', x, y).setDataContext(context) }], direction = true, visible = () => true, enabled = () => true, onClick = () => true) {
        super(x, y, w, h, visible, enabled, onClick);
        this.spacing = spacing;
        this.baseX = x;
        this.attribute = attribute;
        this.baseChildren = baseChildren;
        this.direction = direction;
        this.bgColor = [100];
        this.hvrBgColor = this.bgColor;
        this.baseVisible = visible;
    }

    setDataContext(context) {
        if (context === null) this.context = context;
        else this.context = this.attribute(context);
        if (this.updates)
            this.baseContext = context;

        this.children = [];
        let x = 0;
        let y = 0;
        if (this.context) {
            for (const context of this.context) {
                let increment = 0;
                for (const child of this.baseChildren) {
                    const element = child(context, x, y);
                    this.addChild(element);
                    if (this.direction && element.pos.y + element.h > increment)
                        increment = element.pos.y + element.h;
                    else if (!this.direction && element.pos.x + element.w > increment)
                        increment = element.pos.x + element.w;
                }
                if (this.direction) y = increment + this.spacing;
                else x = increment + this.spacing;
            }
        }

        if (this.direction) this.h = y;
        else {
            this.w = x;
            this.pos.x = this.baseX - (x / 2);
        }
        // this.visible = () => { return this.baseVisible() && this.children.length > 0}
        return this;
    }
}

/**
 * Turn a string into an array of lines split at width
 * @param {string} str                          string
 * @param {number} size                         font size
 * @param {NORMAL|BOLD|ITALIC|BOLDITALIC} style font style
 * @param {number} width                        max width
 * @returns {string[]}                          array of strings
 */
function wrap(str, size, style, width) {
    if (width <= 0)
        return [str];
    textSize(size);
    textStyle(style);
    const words = str.split(" ");
    const lines = [];
    let current = "";
    for (const word of words) {
        const test = current === ""
            ? word
            : current + " " + word;
        if (textWidth(test) <= width) {
            current = test;
        } else {
            if (current !== "")
                lines.push(current);
            current = word;
        }
    }
    // if (current !== "")
        lines.push(current);
    return lines;
};

/**
 * Parses a dataContext string, which is written following the format [attribute.fn().attribute] to get
 * dataContext.attribute.fn().attribute. Id does not include the square brackets []. If blank, gets dataContext itself
 * @param {Object} dataContext  dataContext
 * @param {string} id           dataContext getter string
 * @returns {string}            value
 */
function resolveContextValue(dataContext, id = "") {
    if (id === "")
        return dataContext ?? "";

    let base = dataContext;

    for (const val of id.split('.')) {
        if (base == null)
            return "";

        if (val.endsWith("()")) {
            const fn = base[val.slice(0, -2)];

            if (typeof fn !== "function")
                return "";

            base = fn.call(base);
        } else if (val.endsWith("?")) {
            const prop = val.slice(0, -1);

            if (prop in Object(base))
                base = base[prop];
        } else {
            base = base[val];
        }
    }

    return base ?? "";
}

/**
 * Parses formulas like '50%', '100% - 30', '50 + 10%', etc
 * @param {string|number} value value to parse
 * @param {number} base         base number, like parent value 
 * @returns 
 */
function parseDimension(value, base) {
    if (typeof value === "number") return value;
    if (typeof value !== "string") return 0;

    const expr = value.replace(/\s+/g, "");

    // Numbers, optionally expressed as percentages, joined by + or -
    if (!/^[+-]?(?:\d+\.?\d*|\.\d+)%?(?:[+-](?:\d+\.?\d*|\.\d+)%?)*$/.test(expr)) {
        return Number(value) || 0;
    }

    const terms = expr.match(/[+-]?(?:\d+\.?\d*|\.\d+)%?/g);

    return terms.reduce((total, term) => {
        const isPercent = term.endsWith("%");
        const number = Number(isPercent ? term.slice(0, -1) : term);

        return total + (isPercent ? number / 100 * base : number);
    }, 0);
}

/**
 * Create Interface from JS object
 * @param {Object} json             js object
 * @param {InterfaceElement} parent parent element
 * @param {*} context               context
 * @param {boolean} registerRoot    should we register
 * @returns 
 */
function initializeInterface(json, parent = null, context = null, registerRoot = true) {
    if (!json)
        return null;
    let element;

    /*
     * Resolve the context for this element.
     *
     * If an explicit context was supplied, use it.
     * Otherwise inherit from the parent.
     */
    if (context === null && parent)
        context = parent.dataContext;
    const parentW = parent ? parent.w : RES_X;
    const parentH = parent ? parent.h : RES_Y;

    const x = parseDimension(json.x ?? 0, parentW);
    const y = parseDimension(json.y ?? 0, parentH);
    const w = parseDimension(json.w ?? 0, parentW);
    const h = parseDimension(json.h ?? 0, parentH);

    /*
     * Create the element.
     */
    switch (json.type) {
        case "window": // Window
            element = new InterfaceWindow(
                json.context ?? context,
                x,
                y,
                w,
                h,
                json.padding ?? 0,
                json.spacing ?? 0,
                json.visible ?? (() => true),
                json.enabled ?? (() => true),
                json.onClick ?? (() => true)
            );
            break;
        case "hbox":
            element = new InterfaceHBox(
                json.context ?? context,
                x,
                y,
                w,
                h,
                json.padding ?? 0,
                json.spacing ?? 0,
                json.visible ?? (() => true),
                json.enabled ?? (() => true),
                json.onClick ?? (() => true)
            );
            break;
        case "vbox":
            element = new InterfaceVBox(
                json.context ?? context,
                x,
                y,
                w,
                h,
                json.padding ?? 0,
                json.spacing ?? 0,
                json.visible ?? (() => true),
                json.enabled ?? (() => true),
                json.onClick ?? (() => true)
            );
            break;
        case "text": // Text
            element = new InterfaceText(
                json.text ?? "",
                x,
                y,
                w,
                h,
                json.maxWidth ?? -1,
                json.align ?? LEFT,
                json.style ?? NORMAL,
                json.size ?? 12,
                json.colors ?? [255, 255, 255, 255],
                json.visible ?? (() => true),
                json.enabled ?? (() => true),
                json.onClick ?? (() => true)
            );
            break;
        case "text_tooltip": // Text w/ tooltip
            element = new InterfaceTooltipText(
                json.text ?? "",
                json.header ?? "",
                json.lines ?? [],
                x,
                y,
                w,
                h,
                json.maxWidth ?? -1,
                json.align ?? LEFT,
                json.style ?? NORMAL,
                json.size ?? 12,
                json.colors ?? [255, 255, 255, 255],
                json.visible ?? (() => true),
                json.enabled ?? (() => true),
                json.onClick ?? (() => true)
            );
            break;
        case "button": // Button
            element = new InterfaceButton(
                json.text ?? "",
                x,
                y,
                w,
                h,
                json.style ?? NORMAL,
                json.size ?? 12,
                json.colors ?? [255],
                json.visible ?? (() => true),
                json.enabled ?? (() => true),
                json.onClick ?? (() => true)
            );
            break;
        case "menu_button": // Main Menu Button
            element = new InterfaceMenuButton(
                json.text ?? "",
                x,
                y,
                json.visible ?? (() => true),
                json.enabled ?? (() => true),
                json.onClick ?? (() => true)
            );
            break;
        case "list": // List
            // Children describe template rather than objects
            const factories = [];
            for (const childJSON of json.children ?? []) {
                const obj = { w, h };
                factories.push((itemContext, x, y) => {
                    const child = initializeInterface(
                        childJSON,
                        obj,
                        itemContext,
                        false
                    );
                    /*
                     * The list factory supplies the item's position.
                     */
                    child.pos.x += x;
                    child.pos.y += y;

                    return child;
                });
            }

            element = new InterfaceList(
                (context) => { context },
                x,
                y,
                w,
                h,
                json.spacing ?? 0,
                factories,
                json.direction ?? true,
                json.visible ?? (() => true),
                json.enabled ?? (() => true),
                json.onClick ?? (() => true)
            );
            break;
        case "troopButton": // Troop Button
            element = new InterfaceTroopButton(
                json.troop ?? null,
                x,
                y,
                json.scale ?? 1,
                json.outline ?? true,
                json.tooltip ?? true,
                json.visible ?? (() => true),
                json.enabled ?? (() => true),
                json.onClick ?? (() => true)
            );
            element.enabled = () => !('currency' in mode) || mode.currency >= (element.context?.cost ?? 0)
            break;
        case "line":
            element = new InterfaceLine(
                x,
                y,
                w,
                h,
                json.visible ?? (() => true)
            );
            break;
        case "element": // Generic Element
        default:
            element = new InterfaceElement(
                x,
                y,
                w,
                h,
                json.visible ?? (() => true),
                json.enabled ?? (() => true),
                json.onClick ?? (() => true)
            );
            break;
    }


    /*
     * Apply generic properties.
     */
    if (json.attribute !== undefined)
        element.attribute = json.attribute;
    if (json.bgColor !== undefined)
        element.bgColor = json.bgColor;
    else
        element.bgColor = [0, 0, 0, 0];
    if (json.hvrBgColor !== undefined)
        element.hvrBgColor = json.hvrBgColor;
    else
        element.hvrBgColor = [0, 0, 0, 0];
    if (json.bgColorBase !== undefined)
        element.bgColorBase = json.bgColorBase;
    if (json.hvrBgColorBase !== undefined)
        element.hvrBgColorBase = json.hvrBgColorBase;
    if (json.block !== undefined)
        element.block = json.block;
    else
        element.block = true;
    if (json.padded !== undefined)
        element.padded = json.padded;
    else
        element.padded = true;
    if (json.updates !== undefined)
        element.updates = json.updates;

    element.setDataContext(context);
    /*
     * If this is not a list, recursively create its children.
     * Lists already process their children as factories above.
     */
    if (json.type !== "list") {
        for (const childJSON of json.children ?? []) {
            const child = initializeInterface(
                childJSON,
                element,
                element.dataContext,
                false
            );
            element.addChild(child);
        }
    }
    element.setDataContext(context);
    if (registerRoot) {
        mode.uiElements.push(element);
    }
    return element;
}

const WINDOW_PADDING = 40;
const FACTION_WINDOW_W = 4 * RES_X / 5 + 2 * WINDOW_PADDING;
const FACTION_CENTER_X = FACTION_WINDOW_W / 2;
const FACTION_LIST_W = 2 * RES_X / 5;
const FACTION_SCREEN = {
    type: "window",

    x: '10% - 40',
    y: '50%',
    w: '80% + 80',
    h: 300,
    padding: WINDOW_PADDING,
    spacing: WINDOW_PADDING,
    bgColorBase: "darkerColor",
    hvrBgColorBase: "darkerColor",
    children: [
        {
            type: "text",
            text: "[name]",
            x: '50%',
            y: WINDOW_PADDING,
            align: 'center',
            style: 'bold',
            size: 64
        },
        {
            type: "text",
            text: "[desc]",
            x: '50%',
            y: WINDOW_PADDING + 64,
            align: 'center',
            size: 24,
            maxWidth: FACTION_WINDOW_W - 2 * WINDOW_PADDING
        },
        {
            type: "list",
            attribute: (context) => context.pros,
            x: WINDOW_PADDING,
            y: WINDOW_PADDING + 160,
            w: '50%',
            h: 120,
            block: false,
            children: [
                {
                    type: "text",
                    text: "+ []",
                    x: 0,
                    y: 0,
                    size: 24,
                    colors: [180, 255, 180, 255]
                }
            ]
        },
        {
            type: "list",
            attribute: (context) => context.cons,
            x: '50%',
            y: WINDOW_PADDING + 160,
            w: '50%',
            h: 120,
            children: [
                {
                    type: "text",
                    text: "− []",
                    x: '100% - 40',
                    y: 0,
                    align: 'right',
                    size: 24,
                    colors: [255, 180, 180, 255]
                }
            ]
        },
        {
            type: "list",
            attribute: (context) => context.squads,
            x: '50%',
            y: WINDOW_PADDING + 280,
            w: -1,
            h: 90,
            direction: false,
            spacing: 15,
            children: [
                {
                    type: "troopButton",
                    x: 0,
                    y: 0,
                    scale: 1.5,
                    bgColor: [149, 179, 120],
                    hvrBgColor: [149, 179, 120]
                }
            ]
        },
        {
            type: "button",
            x: '25% + 10',
            // x: (FACTION_WINDOW_W + WINDOW_PADDING) / 4,
            y: WINDOW_PADDING + 400,
            w: '50% - 60',
            h: 50,
            size: 28,
            text: "Go Back",
            bgColorBase: "bgColor",
            hvrBgColorBase: "btnColor",
            style: 'bold',
            block: false,
            onClick: () => { mode.backToSelect() }
        },
        {
            type: "button",
            x: '75% - 10',
            // x: (3 * FACTION_WINDOW_W - WINDOW_PADDING) / 4,
            y: WINDOW_PADDING + 400,
            w: '50% - 60',
            h: 50,
            size: 28,
            text: "Start Battle",
            bgColorBase: "bgColor",
            hvrBgColorBase: "btnColor",
            style: 'bold',
            onClick: () => { mode.startBattle() }
        }
    ]
};

const SIDE_WINDOW_PADDING = 20;
const SIDE_WINDOW_W = 250;
const SQUAD_SCREEN = {
    type: "window",

    x: '100% - 250',
    y: '50%',
    w: SIDE_WINDOW_W,
    h: '60%',
    padding: SIDE_WINDOW_PADDING,
    spacing: SIDE_WINDOW_PADDING,
    bgColor: [50],
    hvrBgColor: [50],
    children: [
        {
            type: "text",
            text: "[base?.name]",
            x: '50%',
            align: 'center',
            style: 'bold',
            size: 24
        },
        {
            type: "list",
            attribute: (context) => {
                if (context instanceof SquadBase)
                    return context.pros;
                if (context instanceof Squad)
                    return context.base.pros;
                return [];
            },
            x: SIDE_WINDOW_PADDING,
            w: SIDE_WINDOW_W - 2 * SIDE_WINDOW_PADDING,
            h: 0,
            padded: false,
            children: [
                {
                    type: "text_tooltip",
                    text: "+ [text]",
                    header: "[text]",
                    x: 0,
                    y: 0,
                    size: 12,
                    maxWidth: SIDE_WINDOW_W - 2 * SIDE_WINDOW_PADDING,
                    colors: [180, 255, 180],
                    lines: [
                        {
                            text: "[tooltip]",
                            colors: [255]
                        }
                    ]
                }
            ]
        },
        {
            type: "list",
            attribute: (context) => {
                if (context instanceof SquadBase)
                    return context.cons;
                if (context instanceof Squad)
                    return context.base.cons;
                return [];
            },
            x: SIDE_WINDOW_PADDING,
            w: SIDE_WINDOW_W - 2 * SIDE_WINDOW_PADDING,
            h: 0,
            children: [
                {
                    type: "text_tooltip",
                    text: "− [text]",
                    header: "[text]",
                    x: 0,
                    y: 0,
                    size: 12,
                    maxWidth: SIDE_WINDOW_W - 2 * SIDE_WINDOW_PADDING,
                    colors: [255, 180, 180],
                    lines: [
                        {
                            text: "[tooltip]",
                            colors: [255]
                        }
                    ]
                }
                // {
                //     type: "text",
                //     text: "− []",
                //     x: 0,
                //     y: 0,
                //     size: 12,
                //     maxWidth: SIDE_WINDOW_W - 2 * SIDE_WINDOW_PADDING,
                //     colors: [255, 180, 180]
                // }
            ]
        },
        {
            type: "list",
            attribute: (context) => {
                if (context instanceof Squad) {
                    return context.sortedTroops;
                } else if (context instanceof SquadBase) {
                    return context.startingTroops.map(startTrp => {
                        return {
                            base: startTrp.troop,
                            maxCount: startTrp.count,
                            count: startTrp.count,
                            kills: 0
                        }
                    })
                }
            },
            x: SIDE_WINDOW_PADDING,
            w: SIDE_WINDOW_W - 2 * SIDE_WINDOW_PADDING,
            spacing: 20,
            children: [
                {
                    type: "troopButton",
                    x: 0,
                    y: 0,
                    scale: 1,
                    attribute: (context) => context.base,
                    outline: false,
                    tooltip: false,
                },
                {
                    type: "text",
                    text: "[base.name]",
                    x: (SIDE_WINDOW_W + 60) / 2,
                    y: 0,
                    size: 14,
                    align: "center",
                    colors: [255]
                },
                {
                    type: "text",
                    text: "Kills",
                    x: 80,
                    y: 20,
                    size: 12,
                    colors: [255]
                },
                {
                    type: "text",
                    text: "[kills]",
                    x: SIDE_WINDOW_W - 2 * SIDE_WINDOW_PADDING,
                    y: 20,
                    size: 12,
                    updates: true,
                    align: "right",
                    colors: [255]
                },
                {
                    type: "text",
                    text: "Count",
                    x: 80,
                    y: 35,
                    size: 12,
                    colors: [255]
                },
                {
                    type: "text",
                    text: "[count] / [maxCount]",
                    updates: true,
                    x: SIDE_WINDOW_W - 2 * SIDE_WINDOW_PADDING,
                    y: 35,
                    size: 12,
                    align: "right",
                    colors: [255]
                },
                {
                    type: "text",
                    text: "Health",
                    x: 80,
                    y: 50,
                    size: 12,
                    colors: [255]
                },
                {
                    type: "text",
                    text: "[base.health][base.regenText][base.shieldText]",
                    x: SIDE_WINDOW_W - 2 * SIDE_WINDOW_PADDING,
                    y: 50,
                    size: 12,
                    align: "right",
                    colors: [255]
                },
                {
                    type: "text_tooltip",
                    text: "Armor",
                    x: 80,
                    y: 65,
                    size: 12,
                    colors: [255],
                    header: "Armor: [base.armor]",
                    lines: [
                        {
                            text: "[base.armorText]",
                            colors: [255]
                        }
                    ]
                },
                {
                    type: "text_tooltip",
                    text: "[base.armor]",
                    x: SIDE_WINDOW_W - 2 * SIDE_WINDOW_PADDING,
                    y: 65,
                    size: 12,
                    align: "right",
                    colors: [255],
                    header: "Armor: [base.armor]",
                    lines: [
                        {
                            text: "[base.armorText]",
                            colors: [255]
                        }
                    ]
                },
                // {
                //     type: "text",
                //     text: "Armor",
                //     x: 80,
                //     y: 65,
                //     size: 12,
                //     colors: [255]
                // },
                // {
                //     type: "text",
                //     text: "[base.armor]",
                //     x: SIDE_WINDOW_W - 2 * SIDE_WINDOW_PADDING,
                //     y: 65,
                //     size: 12,
                //     align: "right",
                //     colors: [255]
                // },
                {
                    type: "text",
                    text: "Speed",
                    x: 80,
                    y: 80,
                    size: 12,
                    colors: [255]
                },
                {
                    type: "text",
                    text: "[base.speed][base.flyingText]",
                    x: SIDE_WINDOW_W - 2 * SIDE_WINDOW_PADDING,
                    y: 80,
                    size: 12,
                    align: "right",
                    colors: [255]
                },
                {
                    type: "vbox",
                    attribute: (context) => context,
                    w: SIDE_WINDOW_W - 2 * SIDE_WINDOW_PADDING,
                    x: 0,
                    y: 95,
                    h: 20,
                    padding: 0,
                    spacing: 10,
                    children: [
                        {
                            type: "list",
                            attribute: (context) => {
                                const weaponCounts = {}
                                for (const mount of context.base.weapons) {
                                    const id = mount.weapon.id;
                                    weaponCounts[id] = (weaponCounts[id] || 0) + 1;
                                }
                                const wepEntries = Object.entries(weaponCounts);
                                const arr = []
                                for (const [id, count] of wepEntries) {
                                    const wep = weapons[id];
                                    arr.push({
                                        name: wep.name,
                                        count: count,
                                        weapon: wep
                                    });
                                }
                                return arr;
                            },
                            x: 80,
                            y: 0,
                            block: true,
                            spacing: 3,
                            w: SIDE_WINDOW_W - SIDE_WINDOW_PADDING - 80,
                            h: 12,
                            children: [
                                {
                                    type: "text_tooltip",
                                    text: "[count]x [name]",
                                    header: "[name]",
                                    size: 12,
                                    lines: [
                                        {
                                            text: "[weapon.tooltip]",
                                            colors: [255]
                                        }
                                    ],
                                    h: 12
                                }
                            ]
                        },
                        {
                            type: "line",
                            x: SIDE_WINDOW_W / 2 - SIDE_WINDOW_PADDING,
                            w: SIDE_WINDOW_W - 2 * SIDE_WINDOW_PADDING,
                            h: 1,
                            bgColor: [255],
                            hvrBgColor: [255],
                            padded: false
                        }
                    ]
                }
            ]
        }
    ]
};

const BATTLE_END_SCREEN = {
    type: "element",
    w: '100%',
    h: '100%',
    x: 0,
    y: 0,
    bgColor: [255, 255, 255, 100],
    hvrBgColor: [255, 255, 255, 100],
    children: [
        {
            type: "text",
            text: "[victory]",
            x: '50%',
            y: '50% - 32',
            align: 'center',
            style: 'bold',
            size: 64,
            colors: [0]
        },
        {
            type: "window",
            x: 0,
            y: '50%',
            w: SIDE_WINDOW_W,
            h: '100% - 80',
            padding: SIDE_WINDOW_PADDING,
            spacing: SIDE_WINDOW_PADDING,
            bgColor: [50],
            hvrBgColor: [50],
            children: [
                {
                    type: "text",
                    text: "Player",
                    x: SIDE_WINDOW_W / 2,
                    align: 'center',
                    style: 'bold',
                    size: 24
                },
                {
                    type: "list",
                    attribute: (context) => context.playerSquads,
                    x: SIDE_WINDOW_PADDING,
                    w: SIDE_WINDOW_W - 2 * SIDE_WINDOW_PADDING,
                    spacing: 15,
                    children: [
                        {
                            type: "troopButton",
                            x: 0,
                            y: 0,
                            scale: 0.75,
                            attribute: (context) => context.base,
                            outline: false,
                            tooltip: false,
                        },
                        {
                            type: "text",
                            text: "[base.name]",
                            x: 60,
                            y: 1.5,
                            size: 12,
                            style: 'bold',
                            colors: [255]
                        },
                        {
                            type: "text",
                            text: "Kills: [kills]",
                            x: 60,
                            y: 16.5,
                            size: 12,
                            colors: [255]
                        },
                        {
                            type: "text",
                            text: "Count: [count] / [maxCount]",
                            x: 60,
                            y: 31.5,
                            size: 12,
                            colors: [255]
                        }
                    ]
                }
            ]
        },
        {
            type: "window",
            x: '100% - 250',
            y: '50%',
            w: SIDE_WINDOW_W,
            h: '100% - 80',
            padding: SIDE_WINDOW_PADDING,
            spacing: SIDE_WINDOW_PADDING,
            bgColor: [50],
            hvrBgColor: [50],
            children: [
                {
                    type: "text",
                    text: "Enemy",
                    x: '50%',
                    align: 'center',
                    style: 'bold',
                    size: 24
                },
                {
                    type: "list",
                    attribute: (context) => context.enemySquads,
                    x: 0,
                    w: '100% - 20',
                    spacing: 15,
                    children: [
                        {
                            type: "troopButton",
                            x: '100% - 80',
                            // x: SIDE_WINDOW_W - SIDE_WINDOW_PADDING - 60,
                            y: 0,
                            scale: 0.75,
                            attribute: (context) => context.base,
                            outline: false,
                            tooltip: false,
                        },
                        {
                            type: "text",
                            text: "[base.name]",
                            x: '100% - 80',
                            // x: SIDE_WINDOW_W - SIDE_WINDOW_PADDING - 60,
                            align: 'right',
                            y: 1.5,
                            size: 12,
                            style: 'bold',
                            colors: [255]
                        },
                        {
                            type: "text",
                            text: "Kills: [kills]",
                            x: '100% - 80',
                            // x: SIDE_WINDOW_W - SIDE_WINDOW_PADDING - 60,
                            align: 'right',
                            y: 16.5,
                            size: 12,
                            colors: [255]
                        },
                        {
                            type: "text",
                            text: "Count: [count] / [maxCount]",
                            x: '100% - 80',
                            // x: SIDE_WINDOW_W - SIDE_WINDOW_PADDING - 60,
                            align: 'right',
                            y: 31.5,
                            size: 12,
                            colors: [255]
                        }
                    ]
                }
            ]
        }
    ]
};

const DEPLOY_SCREEN = {
    type: "window",
    x: '20% - 10',
    w: '60% + 20',
    h: 110,
    y: '100% - 55',
    padding: 10,
    spacing: 10,
    bgColor: [50],
    hvrBgColor: [50],
    children: [
        {
            type: "text",
            text: "Currency: [currencyTxt]",
            x: 10,
            y: 0,
            w: 100,
            size: 16,
            updates: true,
            block: false,
            colors: [255]
        },
        {
            type: "text",
            text: "Wave: [wave]",
            x: '100% - 10',
            y: 0,
            w: 100,
            size: 16,
            updates: true,
            block: false,
            align: 'right',
            colors: [255]
        },
        {
            type: "hbox",
            h: 20,
            x: '50%',
            y: 0,
            w: 50,
            updates: true,
            spacing: 50,
            children: [
                {
                    type: "text",
                    text: "Next Wave: [nextWaveTxt]",
                    y: 0,
                    size: 16,
                    colors: [255]
                },
                {
                    type: "button",
                    y: -2,
                    w: 70,
                    h: 20,
                    size: 12,
                    text: "Start Early",
                    bgColor: [100],
                    hvrBgColor: [150],
                    onClick: () => { mode.nextWave = 0 }
                }
            ]
        },
        {
            type: "hbox",
            h: 60,
            x: '50%',
            y: 0,
            w: '60% - 20',
            padding: 10,
            spacing: 15,
            children: [
                {
                    type: "vbox",
                    w: 20,
                    h: 60,
                    children: [
                        {
                            type: "button",
                            x: 0,
                            w: 20,
                            h: 20,
                            size: 16,
                            text: "⮝",
                            style: 'bold',
                            bgColor: [100],
                            hvrBgColor: [150],
                            enabled: () => mode.speed < 4,
                            onClick: () => {
                                mode.speed = SPEEDS[mode.speed].up ?? mode.speed;
                            }
                        },
                        {
                            type: "text",
                            text: "[pauseBtn]",
                            x: 0,
                            y: 0,
                            w: 20,
                            size: 12,
                            h: 20,
                            align: 'center',
                            updates: true,
                            colors: [255]
                        },
                        {
                            type: "button",
                            x: 0,
                            w: 20,
                            h: 20,
                            size: 16,
                            text: "⮟",
                            style: 'bold',
                            bgColor: [100],
                            hvrBgColor: [150],
                            enabled: () => mode.speed > 0,
                            onClick: () => {
                                mode.speed = SPEEDS[mode.speed].down ?? mode.speed;
                            }
                        }
                    ]
                },
                {
                    type: "list",
                    attribute: (context) => context.playerFaction.squads,
                    x: 0,
                    y: 0,
                    w: -1,
                    h: 60,
                    direction: false,
                    spacing: 15,
                    children: [
                        {
                            type: "troopButton",
                            x: 0,
                            y: 0,
                            scale: 1,
                            bgColor: [149, 179, 120],
                            hvrBgColor: [149, 179, 120],
                            updates: true,
                            onClick: function () {
                                mode.selectNewSquad = this.context;
                                mode.selectedSquad = null;
                                mode.showUI(mode.squadUI, false, mode.selectNewSquad);
                            }
                        }
                    ]
                }
            ]
        },

    ]
}

/**
 * Menu button info
 * @typedef {Object} ButtonInfo
 * @property {string} text                  text
 * @property {number[]} bg                  background colors
 * @property {number[]} hoverBg             hover background colors
 * @property {InterfaceFunction} onClick    onClick function
 */

/**
 * Create a menu selection screen
 * @param {string} header           header text 
 * @param {ButtonInfo[]} buttons    button info
 */
function selectionScreen(header, buttons) {
    textSize(80);
    const width = Math.max(textWidth(header), 800) + WINDOW_PADDING * 2;
    const center = width / 2;
    const window = {
        type: "window",

        x: `50% - ${width / 2}`,
        y: '50%',
        w: width,
        h: 1,
        padding: WINDOW_PADDING,
        spacing: WINDOW_PADDING / 2,
        bgColor: [0],
        hvrBgColor: [0],
        visible: () => false,
        children: [
            {
                type: "text",
                text: header,
                x: center,
                y: WINDOW_PADDING,
                align: 'center',
                style: 'bold',
                size: 80
            }
        ]
    };
    for (const button of buttons) {
        window.children.push({
            type: "menu_button",
            x: center,
            y: 0,
            onClick: button.onClick,
            text: button.text,
            bgColor: button.bg,
            hvrBgColor: button.hoverBg
        });
    }
    return initializeInterface(window, null, null);
};