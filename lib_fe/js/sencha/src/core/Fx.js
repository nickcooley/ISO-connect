/**
 * @class Ext.Anim
 * @extends Object
 *
 * Defines a type of Animation to be used for transitions.
 */
Ext.Anim = Ext.extend(Object, {
    isAnim: true,
    disableAnimations: (Ext.is.Android || Ext.is.Blackberry) ? true : false,

    defaultConfig: {
        /**
         * @cfg {Object} from
         */
        from: {},

        /**
         * @cfg {Object} to
         */
        to: {},

        /**
         * @cfg {Number} duration
         * Time in milliseconds for the animation to last. Defaults to 250.
         */
        duration: 250,

        /**
         * @cfg {Number} delay Time to delay before starting the animation. Defaults to 0.
         */
        delay: 0,

        /**
         * @cfg {String} easing
         * Valid values are 'ease', 'linear', ease-in', 'ease-out', 'ease-in-out' or a cubic-bezier curve as defined by CSS
         * Defaults to 'ease-in-out'
         */
        easing: 'ease-in-out',

        /**
         * @cfg {Boolean} autoClear
         * Defaults to true.
         */
        autoClear: true,

        /**
         * @cfg {Boolean} autoReset
         * Defaults to false
         */
        autoReset: false,

        /**
         * @cfg {Boolean} autoShow
         * Defaults to true.
         */
        autoShow: true,

        /**
         * @cfg {Boolean} out
         * Defaults to true
         */
        out: true,

        /**
         * @cfg {String} direction
         * Valid values are 'left', 'right', 'up', 'down' and null. Defaults to null.
         */
        direction: null,

        /**
         * @cfg {Boolean} reverse
         * Defaults to false.
         */
        reverse: false
    },

    /**
     * @cfg {Function} before
     * Code to execute before starting the animation.
     */

    /**
     * @cfg {Scope} scope
     * Scope to run the before function in.
     */

    opposites: {
        'left': 'right',
        'right': 'left',
        'up': 'down',
        'down': 'up'
    },

    constructor: function(config) {
        config = Ext.apply({}, config || {}, this.defaultConfig);
        this.config = config;

        Ext.Anim.superclass.constructor.call(this);

        this.running = [];
    },

    initConfig : function(el, runConfig) {
        var me = this,
            runtime = {},
            config = Ext.apply({}, runConfig || {}, me.config);

        config.el = el = Ext.get(el);

        if (config.reverse && me.opposites[config.direction]) {
            config.direction = me.opposites[config.direction];
        }

        if (me.config.before) {
            me.config.before.call(config, el, config);
        }

        if (runConfig.before) {
            runConfig.before.call(config.scope || config, el, config);
        }

        return config;
    },

    run: function(el, config) {
        el = Ext.get(el);
        config = config || {};

        var me = this,
            style = el.dom.style,
            property,
            after = config.after;

        config = this.initConfig(el, config);

        if (this.disableAnimations) {
            for (property in config.to) {
                if (!config.to.hasOwnProperty(property)) {
                    continue;
                }
                style[property] = config.to[property];
            }
            this.onTransitionEnd(null, el, {
                config: config,
                after: after
            });
            return me;
        }

        el.un('webkitTransitionEnd', me.onTransitionEnd, me);

        style.webkitTransitionDuration = '0ms';
        for (property in config.from) {
            if (!config.from.hasOwnProperty(property)) {
                continue;
            }
            style[property] = config.from[property];
        }

        setTimeout(function() {
            // If this is a 3d animation we have to set the perspective on the parent
            if (config.is3d === true) {
                el.parent().setStyle({
                    // TODO: Ability to set this with 3dConfig
                    '-webkit-perspective': '1200',
                    '-webkit-transform-style': 'preserve-3d'
                });
            }

            style.webkitTransitionDuration = config.duration + 'ms';
            style.webkitTransitionProperty = 'all';
            style.webkitTransitionTimingFunction = config.easing;

            // Bind our listener that fires after the animation ends
            el.on('webkitTransitionEnd', me.onTransitionEnd, me, {
                single: true,
                config: config,
                after: after
            });

            for (property in config.to) {
                if (!config.to.hasOwnProperty(property)) {
                    continue;
                }
                style[property] = config.to[property];
            }
        }, config.delay || 5);

        me.running[el.id] = config;
        return me;
    },

    onTransitionEnd: function(ev, el, o) {
        el = Ext.get(el);
        var style = el.dom.style,
            config = o.config,
            property,
            me = this;

        if (config.autoClear) {
            for (property in config.to) {
                if (!config.to.hasOwnProperty(property)) {
                    continue;
                }
                style[property] = '';
            }
        }

        style.webkitTransitionDuration = null;
        style.webkitTransitionProperty = null;
        style.webkitTransitionTimingFunction = null;

        if (config.is3d) {
            el.parent().setStyle({
                '-webkit-perspective': '',
                '-webkit-transform-style': ''
            });
        }

        if (me.config.after) {
            me.config.after.call(config, el, config);
        }

        if (o.after) {
            o.after.call(config.scope || me, el, config);
        }

        delete me.running[el.id];
    }
});

Ext.Anim.seed = 1000;

Ext.Anim.run = function(el, anim, config) {
    if (el.isComponent) {
        el = el.el;
    }

    config = config || {};

    if (anim.isAnim) {
        anim.run(el, config);
    }
    else {
        if (Ext.isObject(anim)) {
            if (config.before && anim.before) {
                config.before = Ext.createInterceptor(config.before, anim.before, anim.scope);
            }
            if (config.after && anim.after) {
                config.after = Ext.createInterceptor(config.after, anim.after, anim.scope);
            }
            config = Ext.apply({}, config, anim);
            anim = anim.type;
        }

        if (!Ext.anims[anim]) {
            throw anim + ' is not a valid animation type.';
        }
        else {
            // addl check to make sure dom exists.
            if (el && el.dom) {
                Ext.anims[anim].run(el, config);
            }

        }
    }
};

/**
 * @class Ext.anims
 * @singleton
 *
 * Contains a collection of predefined Ext.Anim's to be used between
 * transitions.
 */
Ext.anims = {
    /**
     * Fade Animation
     */
    fade: new Ext.Anim({
        before: function(el) {
            var fromOpacity = 1,
                toOpacity = 1,
                curZ = el.getStyle('z-index') == 'auto' ? 0 : el.getStyle('z-index'),
                zIndex = curZ;

            if (this.out) {
                toOpacity = 0;
            } else {
                zIndex = curZ + 1;
                fromOpacity = 0;
            }

            this.from = {
                'opacity': fromOpacity,
                'z-index': zIndex
            };
            this.to = {
                'opacity': toOpacity,
                'z-index': zIndex
            };
        }
    }),

    /**
     * Slide Animation
     */
    slide: new Ext.Anim({
        direction: 'left',
        cover: false,
        reveal: false,

        before: function(el) {
            var curZ = el.getStyle('z-index') == 'auto' ? 0 : el.getStyle('z-index'),
                zIndex = curZ + 1,
                toX = 0,
                toY = 0,
                fromX = 0,
                fromY = 0,
                elH = el.getHeight(),
                elW = el.getWidth();

            if (this.direction == 'left' || this.direction == 'right') {
                if (this.out == true) {
                    toX = -elW;
                }
                else {
                    fromX = elW;
                }
            }
            else if (this.direction == 'up' || this.direction == 'down') {
                if (this.out == true) {
                    toY = -elH;
                }
                else {
                    fromY = elH;
                }
            }

            if (this.direction == 'right' || this.direction == 'down') {
                toY *= -1;
                toX *= -1;
                fromY *= -1;
                fromX *= -1;
            }

            if (this.cover && this.out) {
                toX = 0;
                toY = 0;
                zIndex = curZ;
            }
            else if (this.reveal && !this.out) {
                fromX = 0;
                fromY = 0;
                zIndex = curZ;
            }

            this.from = {
                '-webkit-transform': 'translate3d(' + fromX + 'px, ' + fromY + 'px, 0)',
                'z-index': zIndex,
                'opacity': 0.99
            };
            this.to = {
                '-webkit-transform': 'translate3d(' + toX + 'px, ' + toY + 'px, 0)',
                'z-index': zIndex,
                'opacity': 1
            };
        }
    }),

    cardslide: new Ext.Anim({
        direction: 'left',
        cover: false,
        reveal: false,
        previousIndex : 0,
        newIndex : 0,

        before: function(el) {
            var curZ = el.getStyle('z-index') == 'auto' ? 0 : el.getStyle('z-index'),
                zIndex = curZ + 1,
                toX = 0,
                toY = 0,
                fromX = 0,
                fromY = 0,
                elH = el.getHeight(),
                elW = el.getWidth();

            if (/left|right/i.test(this.direction)) {

                if (this.previousIndex || this.newIndex) {
	                this.direction = this.previousIndex > this.newIndex ? 'right' : 'left';
	            }
                if (this.out === true) {
                    toX = -elW;
                }
                else {
                    fromX = elW;
                }
            }

            if (this.direction == 'right') {
                toY *= -1;
                toX *= -1;
                fromY *= -1;
                fromX *= -1;
            }

            if (this.cover && this.out) {
                toX = 0;
                toY = 0;
                zIndex = curZ;
            }
            else if (this.reveal && !this.out) {
                fromX = 0;
                fromY = 0;
                zIndex = curZ;
            }

            this.from = {
                '-webkit-transform': 'translate3d(' + fromX + 'px, ' + fromY + 'px, 0)',
                'z-index': zIndex,
                'opacity': 0.99
            };
            this.to = {
                '-webkit-transform': 'translate3d(' + toX + 'px, ' + toY + 'px, 0)',
                'z-index': zIndex,
                'opacity': 1
            };
        }
    }),

    /**
     * Flip Animation
     */
    flip: new Ext.Anim({
        is3d: true,
        direction: 'left',
        before: function(el) {
            var rotateProp = 'Y',
                fromScale = 1,
                toScale = 1,
                fromRotate = 0,
                toRotate = 0;

            if (this.out) {
                toRotate = -180;
                toScale = 0.8;
            }
            else {
                fromRotate = 180;
                fromScale = 0.8;
            }

            if (this.direction == 'up' || this.direction == 'down') {
                rotateProp = 'X';
            }

            if (this.direction == 'right' || this.direction == 'left') {
                toRotate *= -1;
                fromRotate *= -1;
            }

            this.from = {
                '-webkit-transform': 'rotate' + rotateProp + '(' + fromRotate + 'deg) scale(' + fromScale + ')',
                '-webkit-backface-visibility': 'hidden'
            };
            this.to = {
                '-webkit-transform': 'rotate' + rotateProp + '(' + toRotate + 'deg) scale(' + toScale + ')',
                '-webkit-backface-visibility': 'hidden'
            };
        }
    }),

    /**
     * Cube Animation
     */
    cube: new Ext.Anim({
        is3d: true,
        direction: 'left',
        style: 'outer',
        before: function(el) {
            var origin = '0% 0%',
                fromRotate = 0,
                toRotate = 0,
                rotateProp = 'Y',
                fromZ = 0,
                toZ = 0,
                fromOpacity = 1,
                toOpacity = 1,
                zDepth,
                elW = el.getWidth(),
                elH = el.getHeight(),
                showTranslateZ = true,
                fromTranslate = ' translateX(0)',
                toTranslate = '';

            if (this.direction == 'left' || this.direction == 'right') {
                if (this.out) {
                    origin = '100% 100%';
                    toZ = elW;
                    toOpacity = 0.5;
                    toRotate = -90;
                } else {
                    origin = '0% 0%';
                    fromZ = elW;
                    fromOpacity = 0.5;
                    fromRotate = 90;
                }
            } else if (this.direction == 'up' || this.direction == 'down') {
                rotateProp = 'X';
                if (this.out) {
                    origin = '100% 100%';
                    toZ = elH;
                    toRotate = 90;
                } else {
                    origin = '0% 0%';
                    fromZ = elH;
                    fromRotate = -90;
                }
            }

            if (this.direction == 'down' || this.direction == 'right') {
                fromRotate *= -1;
                toRotate *= -1;
                origin = (origin == '0% 0%') ? '100% 100%': '0% 0%';
            }

            if (this.style == 'inner') {
                fromZ *= -1;
                toZ *= -1;
                fromRotate *= -1;
                toRotate *= -1;

                if (!this.out) {
                    toTranslate = ' translateX(0px)';
                    origin = '0% 50%';
                } else {
                    toTranslate = fromTranslate;
                    origin = '100% 50%';
                }
            }

            this.from = {
                '-webkit-transform': 'rotate' + rotateProp + '(' + fromRotate + 'deg)' + (showTranslateZ ? ' translateZ(' + fromZ + 'px)': '') + fromTranslate,
                '-webkit-transform-origin': origin
            };
            this.to = {
                '-webkit-transform': 'rotate' + rotateProp + '(' + toRotate + 'deg) translateZ(' + toZ + 'px)' + toTranslate,
                '-webkit-transform-origin': origin
            };
        },
        duration: 250
    }),

    /**
     * Pop Animation
     */
    pop: new Ext.Anim({
        scaleOnExit: true,
        before: function(el) {
            var fromScale = 1,
                toScale = 1,
                fromOpacity = 1,
                toOpacity = 1,
                curZ = el.getStyle('z-index') == 'auto' ? 0 : el.getStyle('z-index'),
                fromZ = curZ,
                toZ = curZ;

            if (!this.out) {
                fromScale = 0.01;
                fromZ = curZ + 1;
                toZ = curZ + 1;
                fromOpacity = 0;
            }
            else {
                if (this.scaleOnExit) {
                    toScale = 0.01;
                    toOpacity = 0;
                } else {
                    toOpacity = 0.8;
                }
            }

            this.from = {
                '-webkit-transform': 'scale(' + fromScale + ')',
                '-webkit-transform-origin': '50% 50%',
                'opacity': fromOpacity,
                'z-index': fromZ
            };

            this.to = {
                '-webkit-transform': 'scale(' + toScale + ')',
                '-webkit-transform-origin': '50% 50%',
                'opacity': toOpacity,
                'z-index': toZ
            };
        }
    }),

    /**
     * Wipe Animation.
     * <p>Because of the amount of calculations involved, this animation is best used on small display
     * changes or specifically for phone environments. Does not currently accept any parameters.</p>
     */
    wipe: new Ext.Anim({
        before: function(el) {
            var curZ = el.getStyle('z-index'),
                mask = '',
                toSize = '100%',
                fromSize = '100%';

            if (!this.out) {
                zindex = curZ + 1;
                mask = '-webkit-gradient(linear, left bottom, right bottom, from(transparent), to(#000), color-stop(66%, #000), color-stop(33%, transparent))';
                toSize = el.getHeight() * 100 + 'px';
                fromSize = el.getHeight();

                this.from = {
                    '-webkit-mask-image': mask,
                    '-webkit-mask-size': el.getWidth() * 3 + 'px ' + el.getHeight() + 'px',
                    'z-index': zIndex,
                    '-webkit-mask-position-x': 0
                };
                this.to = {
                    '-webkit-mask-image': mask,
                    '-webkit-mask-size': el.getWidth() * 3 + 'px ' + el.getHeight() + 'px',
                    'z-index': zIndex,
                    '-webkit-mask-position-x': -el.getWidth() * 2 + 'px'
                };
            }
        },
        duration: 500
    })
};