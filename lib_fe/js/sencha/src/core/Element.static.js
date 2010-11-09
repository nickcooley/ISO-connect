Ext.applyIf(Ext.Element, {
    unitRe: /\d+(px|em|%|en|ex|pt|in|cm|mm|pc)$/i,
    camelRe: /(-[a-z])/gi,
    opacityRe: /alpha\(opacity=(.*)\)/i,
    propertyCache: {},
    defaultUnit : "px",
    borders: {l: 'border-left-width', r: 'border-right-width', t: 'border-top-width', b: 'border-bottom-width'},
    paddings: {l: 'padding-left', r: 'padding-right', t: 'padding-top', b: 'padding-bottom'},
    margins: {l: 'margin-left', r: 'margin-right', t: 'margin-top', b: 'margin-bottom'},

    addUnits : function(size) {
        if (size === "" || size == "auto" || size === null || size === undefined) {
            size = size || '';
        }
        else if (!isNaN(size) || !this.unitRe.test(size)) {
            size = size + (this.defaultUnit || 'px');
        }
        return size;
    },

    /**
     * Parses a number or string representing margin sizes into an object. Supports CSS-style margin declarations
     * (e.g. 10, "10", "10 10", "10 10 10" and "10 10 10 10" are all valid options and would return the same result)
     * @param {Number|String} box The encoded margins
     * @return {Object} An object with margin sizes for top, right, bottom and left
     */
    parseBox : function(box) {
        if (typeof box != 'string') {
            box = box.toString();
        }
        var parts  = box.split(' '),
            ln = parts.length;

        if (ln == 1) {
            parts[1] = parts[2] = parts[3] = parts[0];
        }
        else if (ln == 2) {
            parts[2] = parts[0];
            parts[3] = parts[1];
        }
        else if (ln == 3) {
            parts[3] = parts[1];
        }

        return {
            top   :parseFloat(parts[0]) || 0,
            right :parseFloat(parts[1]) || 0,
            bottom:parseFloat(parts[2]) || 0,
            left  :parseFloat(parts[3]) || 0
        };
    },
    
    /**
     * Parses a number or string representing margin sizes into an object. Supports CSS-style margin declarations
     * (e.g. 10, "10", "10 10", "10 10 10" and "10 10 10 10" are all valid options and would return the same result)
     * @param {Number|String} box The encoded margins
     * @return {String} An string with unitized (px) metrics for top, right, bottom and left
     */
    unitizeBox : function(box){
        var A = this.addUnits,
            B = this.parseBox(box);
            
        return A( B.top ) + ' ' +
               A( B.right ) + ' ' +
               A( B.bottom ) + ' ' +
               A( B.left );
        
    },

    // private
    camelReplaceFn : function(m, a) {
        return a.charAt(1).toUpperCase();
    },

    /**
     * Normalizes CSS property keys from dash delimited to camel case JavaScript Syntax.
     * For example:
     * <ul>
     *  <li>border-width -> borderWidth</li>
     *  <li>padding-top -> paddingTop</li>
     * </ul>
     */
    normalize : function(prop) {
        return this.propertyCache[prop] || (this.propertyCache[prop] = prop == 'float' ? 'cssFloat' : prop.replace(this.camelRe, this.camelReplaceFn));
    },

    /**
     * Retrieves the document height
     * @returns {Number} documentHeight
     */
    getDocumentHeight: function() {
        return Math.max(!Ext.isStrict ? document.body.scrollHeight : document.documentElement.scrollHeight, this.getViewportHeight());
    },

    /**
     * Retrieves the document width
     * @returns {Number} documentWidth
     */
    getDocumentWidth: function() {
        return Math.max(!Ext.isStrict ? document.body.scrollWidth : document.documentElement.scrollWidth, this.getViewportWidth());
    },

    /**
     * Retrieves the viewport height of the window.
     * @returns {Number} viewportHeight
     */
    getViewportHeight: function(){
        return window.innerHeight;
    },

    /**
     * Retrieves the viewport width of the window.
     * @returns {Number} viewportWidth
     */
    getViewportWidth : function() {
        return window.innerWidth;
    },

    /**
     * Retrieves the viewport size of the window.
     * @returns {Object} object containing width and height properties
     */
    getViewSize : function() {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    },

    /**
     * Retrieves the current orientation of the window. This is calculated by
     * determing if the height is greater than the width.
     * @returns {String} Orientation of window: 'portrait' or 'landscape'
     */
    getOrientation : function() {
        if (Ext.supports.OrientationChange) {
            return (window.orientation == 0) ? 'portrait' : 'landscape';
        }
        
        return (window.innerHeight > window.innerWidth) ? 'portrait' : 'landscape';
    },

    /** Returns the top Element that is located at the passed coordinates
     * Function description
     * @param {Number} x The x coordinate
     * @param {Number} x The y coordinate
     * @return {String} The found Element
     */
    fromPoint: function(x, y) {
        return Ext.get(document.elementFromPoint(x, y));
    },

    /**
     * Returns the calculated CSS 2D transform offset values (translate x and y)
     * @param {Ext.Element/Element} el the element
     * @return {Ext.util.Offset} instance of Ext.util.Offset, with x and y properties
     */
    getComputedTransformOffset: function(el) {
        if (el instanceof Ext.Element)
            el = el.dom;

        var cssMatrix = new WebKitCSSMatrix(window.getComputedStyle(el).webkitTransform);

        if (typeof cssMatrix.m41 != 'undefined') {
            return new Ext.util.Offset(cssMatrix.m41, cssMatrix.m42);
        } else if (typeof cssMatrix.d != 'undefined') {
            return new Ext.util.Offset(cssMatrix.d, cssMatrix.e);
        }

        return new Ext.util.Offset(0, 0);
    },

    /**
     * Transform an element using CSS 3
     * @param {Ext.Element/Element} el the element
     * @param {Object} transforms an object with all transformation to be applied. The keys are transformation method names,
     * the values are arrays of params or a single number if there's only one param e.g:
     * {
     *      translate: [0, 1, 2],
     *      scale: 0.5,
     *      skew: -25,
     *      rotate: 7
     * }
     */
    cssTransform: function(el, transforms) {
        if (el instanceof Ext.Element)
            el = el.dom;

        var m = new WebKitCSSMatrix();

        Ext.iterate(transforms, function(n, v) {
            v = Ext.isArray(v) ? v : [v];
            m = m[n].apply(m, v);
        });

        // To enable hardware accelerated transforms on iOS (v3 only, fixed in v4?) we have to build the string manually
        // Other than that simply apply the matrix works perfectly on all the rest of devices
        if (Ext.supports.CSS3DTransform) {
            el.style.webkitTransform = 'matrix3d(' +
                                            m.m11+', '+m.m12+', '+m.m13+', '+m.m14+', '+
                                            m.m21+', '+m.m22+', '+m.m23+', '+m.m24+', '+
                                            m.m31+', '+m.m32+', '+m.m33+', '+m.m34+', '+
                                            m.m41+', '+m.m42+', '+m.m43+', '+m.m44+
                                       ')';
        } else {
            el.style.webkitTransform = m;
        }
    }
});
