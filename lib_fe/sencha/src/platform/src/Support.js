/**
 * @class Ext.is
 * @singleton
 *
 * Determines information about the current platform the application is running on.
 */
Ext.is = {
    init : function() {
        var platforms = this.platforms,
            ln = platforms.length,
            i, platform;

        for (i = 0; i < ln; i++) {
            platform = platforms[i];
            this[platform.identity] = platform.regex.test(platform.string);
        }

        /**
         * @property Desktop
         * @type {Boolean}
         */
        this.Desktop = this.Mac || this.Windows || (this.Linux && !this.Android);
        /**
         * @property Tablet
         */
        this.Tablet = this.iPad;
        /**
         * @property Phone
         * @type {Boolean}
         */
        this.Phone = !this.Desktop && !this.Tablet;
        /**
         * @property iOS
         * @type {Boolean}
         */
        this.iOS = this.iPhone || this.iPad || this.iPod;
    },
    /**
     * @property iPhone
     */
    platforms: [{
        string: navigator.platform,
        regex: /iPhone/i,
        identity: 'iPhone'
    },
    /**
     * @property iPod
     * @type {Boolean}
     */
    {
        string: navigator.platform,
        regex: /iPod/i,
        identity: 'iPod'
    },
    /**
     * @property iPad
     * @type {Boolean}
     */
    {
        string: navigator.userAgent,
        regex: /iPad/i,
        identity: 'iPad'
    },
    /**
     * @property Blackberry
     * @type {Boolean}
     */
    {
        string: navigator.userAgent,
        regex: /Blackberry/i,
        identity: 'Blackberry'
    },
    /**
     * @property Android
     * @type {Boolean}
     */
    {
        string: navigator.userAgent,
        regex: /Android/i,
        identity: 'Android'
    },
    /**
     * @property Mac
     * @type {Boolean}
     */
    {
        string: navigator.platform,
        regex: /Mac/i,
        identity: 'Mac'
    },
    /**
     * @property Windows
     * @type {Boolean}
     */
    {
        string: navigator.platform,
        regex: /Win/i,
        identity: 'Windows'
    },
    /**
     * @property Linux
     * @type {Boolean}
     */
    {
        string: navigator.platform,
        regex: /Linux/i,
        identity: 'Linux'
    }]
};

Ext.is.init();

/**
 * @class Ext.supports
 * @singleton
 *
 * Determines information about features are supported in the current environment
 */
Ext.supports = {
    init : function() {
        var doc = document,
            div = doc.createElement('div'),
            tests = this.tests,
            ln = tests.length,
            i, test;

        div.innerHTML = [
            '<div style="height:30px;width:50px;">',
                '<div style="height:20px;width:20px;"></div>',
            '</div>',
            '<div style="float:left; background-color:transparent;"></div>'
        ].join('');

        doc.body.appendChild(div);

        for (i = 0; i < ln; i++) {
            test = tests[i];
            this[test.identity] = test.fn.call(this, doc, div);
        }

        doc.body.removeChild(div);
    },

    /**
     * @property OrientationChange
     * @type {Boolean}
     */
    OrientationChange : !Ext.is.Desktop && (window.orientation !== undefined),

    tests: [
    /**
     * @property CSS3 Transitions
     * @type {Boolean}
     */
    {
        identity: 'Transitions',
        fn: function(doc, div) {
            var prefix = [
                    'webkit',
                    'Moz',
                    'o',
                    'ms',
                    'khtml'
                ],
                TE = 'TransitionEnd',
                transitionEndName = [
                    prefix[0] + TE,
                    'transitionend', //Moz bucks the prefixing convention
                    prefix[2] + TE,
                    prefix[3] + TE,
                    prefix[4] + TE
                ],
                ln = prefix.length,
                i = 0,
                out = false;
            div = Ext.get(div);
            for (; i < ln; i++) {
                if (div.getStyle(prefix[i] + "TransitionProperty")) {
                    Ext.supports.CSS3Prefix = prefix[i];
                    Ext.supports.CSS3TransitionEnd = transitionEndName[i];
                    out = true;
                    break;
                }
            }
            return out;
        }
    },
    /**
     * @property Touch
     * @type {Boolean}
     */
    {
        identity: 'Touch',
        fn: function(doc, div) {
            return (!Ext.is.Desktop && ('ontouchstart' in div));
        }
    },
    /**
     * @property RightMargin
     * @type {Boolean}
     */
    {
        identity: 'RightMargin',
        fn: function(doc, div, view) {
            view = doc.defaultView;
            return !(view && view.getComputedStyle(div.firstChild.firstChild, null).marginRight != '0px');
        }
    },
    /**
     * @property TransparentColor
     * @type {Boolean}
     */
    {
        identity: 'TransparentColor',
        fn: function(doc, div, view) {
            view = doc.defaultView;
            return !(view && view.getComputedStyle(div.lastChild, null).backgroundColor != 'transparent');
        }
    },
    /**
     * @property SVG Support
     * @type {Boolean}
     */
    {
        identity: 'SVG',
        fn: function(doc) {
            return !!doc.createElementNS && !!doc.createElementNS( "http:/" + "/www.w3.org/2000/svg", "svg").createSVGRect;
        }
    },
    
    /**
     * @property Canvas Support
     * @type {Boolean}
     */
    {
        identity: 'Canvas',
        fn: function(doc) {
            return !!doc.createElement('canvas').getContext;
        }
    },
    /**
     * @property VML Support
     * @type {Boolean}
     */
    {
        identity: 'VML',
        fn: function(doc) {
            var d = doc.createElement("div");
            d.innerHTML = "<!--[if vml]><br><br><![endif]-->";
            return (d.childNodes.length == 2);
        }
    },
    /**
     * @property Float
     * @type {Boolean}
     */
    {
        identity: 'Float',
        fn: function(doc, div) {
            return !!div.lastChild.style.cssFloat;
        }
    },
    /**
     * @property AudioTag
     * @type {Boolean}
     */
    {
        identity: 'AudioTag',
        fn: function(doc) {
            return !!doc.createElement('audio').canPlayType;
        }
    }]
};