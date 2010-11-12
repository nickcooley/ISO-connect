/**
 * @class Ext.util.Scroller
 * @extends Ext.util.Observable
 */
Ext.util.Scroller = Ext.extend(Ext.util.Observable, {
    /**
     * @cfg {Boolean/String} bounces
     * Enable bouncing during scrolling past the bounds. Defaults to true. (Which is 'both').
     * You can also specify 'vertical', 'horizontal', or 'both'
     */
    bounces: (Ext.is.Android || Ext.is.Blackberry) ? false : true,

    momentumResetTime: (Ext.is.Android || Ext.is.Blackberry) ? 1000 : 100,

    /**
     * @cfg {Number} friction
     * The friction of the scroller.
     * By raising this value the length that momentum scrolls becomes shorter. This value is best kept
     * between 0 and 1. The default value is 0.3
     */
    friction: 0.3,
    acceleration: 25,

    /**
     * @cfg {Boolean} momentum
     * Enable momentum scrolling. Defaults to false on Blackberry and Android.
     */
    momentum: Ext.is.Blackberry ? false : true,

    /**
     * @cfg {Boolean} horizontal
     * Enable horizontal scrolling. Defaults to false.
     */
    horizontal: false,

    /**
     * @cfg {Boolean} vertical
     * Enables vertical scrolling. Defaults to true.
     */
    vertical: true,

    /**
     * @cfg {Boolean/Number/Object} snap
     * Snaps to to a grid after each scroll. Defaults to false.
     * This can either be a number in which case it will be used for both horizontal and vertical snapping.
     * You can also pass an object with x and y properties.
     * By passing true the snapping value will default to 50.
     */
    snap: false,

    /**
     * @cfg {Boolean} scrollbars
     * Turn on a visual ui indicator for scrolling. Defaults to true.
     */
    scrollbars: true,

    /**
     * @cfg {Number} fps
     * The desired fps of the deceleration. Defaults to 60.
     */
    fps: 60,

    /**
     * @cfg {Number} springTension
     * The tension of the spring that is attached to the scroller when it bounces.
     * By raising this value the bounce becomes shorter. This value is best kept
     * between 0 and 1. The default value is 0.3
     */
    springTension: 0.3,

    /**
     * @cfg {String} ui
     * The ui you want to use for this scroller. This affects the scrollbar colors.
     * Can be dark or light. Defaults to dark.
     */
    ui: 'dark',

    /**
     * @cfg {String} scrollToEasing
     * The default easing to use when calling scrollTo with animate true.
     * Defaults to cubic-bezier(0.4, .75, 0.5, .95).
     */
    scrollToEasing : 'cubic-bezier(0.4, .75, 0.5, .95)',
    /**
     * @cfg {Number} scrollToDuration
     * The default duration of the transition when calling scrollTo with animate true.
     * Defaults to 300.
     */
    scrollToDuration: 300,

    /**
     * @cfg {Number} snapDuration
     * The default duration of the snap.
     * Defaults to 150.
     */
    snapDuration: 150,
    
    /**
     * @cfg {Boolean} preventActualScroll
     * By setting this to true, the scroller won't actually scroll. It will just fire
     * events.
     */
    preventActualScroll: false,
    
    translateOpen: (Ext.is.Android || Ext.is.Blackberry)  ? 'translate(' : 'translate3d(',
    translateClose: (Ext.is.Android || Ext.is.Blackberry) ? ')' : ', 0px)',

    /**
     * @cfg {Boolean} eventTarget
     * You can specify the event target for this scroller. This is the element that we
     * will bind the scroll events to. You usually don't have to specify this except for
     * specific cases (like bridging the scroll events through an overlaying mask).
     */
         
    /**
     * @constructor
     * @param {Mixed} el An Ext.Element, HTMLElement or string linking to the id
     * of an Element.
     * @param {Object} config
     */
    constructor : function(el, config) {
        el = Ext.get(el);
        
        var me = this,
            scroller = Ext.ScrollManager.get(el.id);        
        if (scroller) {
            return Ext.apply(scroller, config);
        }
                
        config = config || {};
        Ext.apply(me, config);

        me.addEvents(
            /**
             * @event scrollstart
             * @param {Ext.Scroller} this
             * @param {Ext.EventObject} e
             */
            'scrollstart',
            /**
             * @event scrollend
             * @param {Ext.Scroller} this
             * @param {Object} offsets An object containing the x and y offsets for the scroller.
             */
            'scrollend',
            /**
             * @event scroll
             * @param {Ext.Scroller} this
             * @param {Object} offsets An object containing the x and y offsets for the scroller.
             */
            'scroll'
        );

        Ext.util.Scroller.superclass.constructor.call(me);

        scroller = me.scroller = this.el = el;
        this.id = el.id;
        
        Ext.ScrollManager.register(this);
        
        scroller.addClass('x-scroller');
        me.parent = scroller.parent();
        me.parent.addClass('x-scroller-parent');

        me.offset = {x: 0, y: 0};        
        me.omega = 1 - (me.friction / 10);
        
        // Set up the touch start event handler.
        // On touch start we will cancel any running transitions
        var eventTarget = me.eventTarget ? Ext.get(me.eventTarget) : me.parent;
        eventTarget.on({
            touchstart: me.onTouchStart,
            scrollstart: me.onScrollStart,
            scroll: me.onScroll,
            scrollend: me.onScrollEnd,
            horizontal: me.horizontal,
            vertical: me.vertical,
            scope: me
        });

        if (me.bounces !== false) {
            var both = me.bounces === 'both' || me.bounces === true,
                horizontal = both || me.bounces === 'horizontal',
                vertical = both || me.bounces === 'vertical';

            me.bounces = {
                horizontal: horizontal,
                vertical: vertical
            };
        }

        if (me.scrollbars) {
            if (me.horizontal) {
                me.scrollbarX = new Ext.util.Scroller.Scrollbar(me, 'horizontal');
            }

            if (me.vertical) {
                me.scrollbarY = new Ext.util.Scroller.Scrollbar(me, 'vertical');
            }
        }
     
        me.scroller.on({
            'webkitTransitionEnd': me.onTransitionEnd,
            scope: me
        });
        return me;
    },

    // @private
    onTouchStart : function(e) {
        var me = this,
            scroller = me.scroller,
            style = scroller.dom.style,
            transform;

        
        if (!e || e.touches.length > 1) {
            return;
        }
        
        me.updateBounds();
        me.followTouch = e.touch;

        if (me.animating) {
            clearInterval(me.scrollInterval);
            
            // Stop the current transition.
            if (me.inTransition) {
                transform = new WebKitCSSMatrix(window.getComputedStyle(scroller.dom).webkitTransform);
                style.webkitTransitionDuration = '0ms';
                style.webkitTransform = me.translateOpen + transform.m41 + 'px, ' + transform.m42 + 'px' + me.translateClose;

                me.offset = {
                    x: transform.m41,
                    y: transform.m42
                };
                me.inTransition = false;
            }

            me.snapToBounds(false);

            if (me.scrollbarX) {
                me.scrollbarX.stop();
            }
            if (me.scrollbarY) {
                me.scrollbarY.stop();
            }

            me.animating = false;
            me.doScrollEnd();
        }

        if (me.momentum) {
            me.resetMomentum(e);
        }
    },

    // @private
    onScrollStart : function(e, t) {
        var me = this;
        // This will prevent the click event to be fired during the scroll operation
        // Ext.getDoc().on('click', function(e) {
        //     e.preventDefault();
        // }, this, {single: true});
        if (!e || e.touch != me.followTouch) {
            return;
        }

        if (me.momentum) {
            me.addMomentum(e);
        }

        me.fireEvent('scrollstart', me, e);
    },

    // @private
    onScroll : function(e, t) {
        var me = this;
        
        if (!e || e.touch != me.followTouch) {
            return;
        }

        e.stopEvent();

        var previousDeltaX = e.previousDeltaX,
            previousDeltaY = e.previousDeltaY,
            newX = me.horizontal ? (me.offset.x + previousDeltaX) : 0,
            newY = me.vertical ? (me.offset.y + previousDeltaY) : 0,
            boundsPos = me.constrainToBounds({x: newX, y: newY}),
            pos;

        me.bouncing = {
            x: false,
            y: false
        };
        
        // If bounces is enabled, we want to slow down the drag
        if (me.bounces) {
            if (me.bounces.horizontal && boundsPos.x != newX) {
                newX = me.offset.x + (previousDeltaX / 2);
                me.bouncing.x = true;
            }
            else {
                newX = boundsPos.x;
            }
            
            if (me.bounces.vertical && boundsPos.y != newY) {
                newY = me.offset.y + (previousDeltaY / 2);
                me.bouncing.y = true;
            }
            else {
                newY = boundsPos.y;
            }

            pos = {x: newX, y: newY};
        }
        else {
            pos = boundsPos;
        }

        // Perform the actual scroll
        me._scrollTo(pos);

        if (me.momentum) {
            // Add the current offset as a momentum point
            me.addMomentum(e);
        }
    },

    doScrollEnd : function() {
        var me = this;
        if (me.scrollbarX) {
            me.scrollbarX.hide(true);
        }
        if (me.scrollbarY) {
            me.scrollbarY.hide(true);
        }
        me.fireEvent('scrollend', me, me.getOffset());
    },
    
    // We are going to decelerate based on the momentum
    // @private
    onScrollEnd : function(e, t) {
        var me = this;
        
        if (e.touch != me.followTouch) {
            return;
        }

        // This will clear out all momentum points that arent valid anymore
        if (me.momentum) {
            me.validateMomentum(e);
            if (me.momentumPoints.length > 1) {
                var momentum = me.momentumPoints,

                    // Get the first and last points that are within the momentum
                    oldestMomentum = momentum.shift(),
                    latestMomentum = momentum.pop(),

                    // The distance we have dragged within this momentum
                    distance = {
                        x: latestMomentum.offset.x - oldestMomentum.offset.x,
                        y: latestMomentum.offset.y - oldestMomentum.offset.y
                    },

                    // Determine the duration of the momentum
                    duration = (latestMomentum.time - oldestMomentum.time),

                    // Determine the deceleration velocity
                    velocity = {
                        x: distance.x / (duration / me.acceleration),
                        y: distance.y / (duration / me.acceleration)
                    };
                me.applyVelocity(velocity);
            }
        }

        // If there is no animation or deceleration going on, then make sure we are within bounds
        if (!me.animating) {
            me.snapToBounds(true);
        }

        // If the snapToBounds call above has been fired we can suddenly be animating again which
        // means the scroll has not ended yet
        if (!me.animating) {
            me.doScrollEnd();
        }
    },

    // @private
    onTransitionEnd : function() {
        var me = this;
        
        if (me.inTransition) {
            me.scroller.dom.style.webkitTransitionDuration = '0ms';
            me.inTransition = false;
            me.animating = false;
            me.doScrollEnd();
        }
    },

    /**
     * Scroll to a position with optional animation
     * @param {Object} pos An object with x and y scroll position
     * @param {Mixed} animate Time in ms or an animation config object
     * @param {String} easing Type of easing
     */
    scrollTo : function(pos, animate, easing) {
        var me = this;
        
        // store the actual position in a private variable
        pos = me.constrainToBounds({x: Math.round(-pos.x || 0), y: Math.round(-pos.y || 0)});
        clearInterval(me.scrollInterval);
        
        if (me.offset.x == pos.x && me.offset.y == pos.y) {
            return false;
        }
        
        if (animate && !me.preventActualScroll) {
            me.animating = true;
            me.inTransition = true;

            // We scroll using webkit transforms in combination with the translate property.
            // This is much faster then animating the top and left values
            var style = me.scroller.dom.style;
            style.webkitTransitionTimingFunction = easing || me.scrollToEasing;
            style.webkitTransitionDuration = (typeof animate == 'number') ? (animate + 'ms') : (me.scrollToDuration + 'ms');
            style.webkitTransform = me.translateOpen + pos.x + 'px, ' + pos.y + 'px' + me.translateClose;

            me.offset = pos;

            if (me.scrollbarX) {
                me.scrollbarX.scrollTo(pos, animate, easing || me.scrollToEasing);
            }

            if (me.scrollbarY) {
                me.scrollbarY.scrollTo(pos, animate, easing || me.scrollToEasing);
            }
        }
        else {
            me._scrollTo({x: pos.x, y: pos.y});
            me.doScrollEnd();
        }
        return me;
    },

    /**
     * @private
     * Handles the actual transformation to scroll
     */
    _scrollTo : function(pos) {
        var me = this;
        me.offset = {x: Math.round(pos.x), y: Math.round(pos.y)};

        if (!me.preventActualScroll) {
            var style = me.scroller.dom.style;
            style.webkitTransitionDuration = '0ms';        
            style.webkitTransform = me.translateOpen + me.offset.x + 'px, ' + me.offset.y + 'px' + me.translateClose;

            if (me.scrollbarX) {
                me.scrollbarX.scrollTo(me.offset);
            }

            if (me.scrollbarY) {
                me.scrollbarY.scrollTo(me.offset);
            }            
        }

        me.fireEvent('scroll', me, me.getOffset());
    },
    
    /**
     * Returns the current scroll offset.
     * @return {Object} An object containing x and y properties.
     */    
    getOffset : function() {
        return {x: -this.offset.x, y: -this.offset.y};
    },

    /**
     * Handle scroll is being passed a velocity and based on that will decelerate etc.
     * @private
     */
    applyVelocity : function(velocity) {
        velocity = velocity || {x: 0, y: 0};

        var me = this,
            offset = me.offset,
            currentTime = (new Date()).getTime(),
            deceleration = me.deceleration = {
                startTime: currentTime,
                startOffset: {
                    x: offset.x,
                    y: offset.y
                },
                logFriction: Math.log(me.omega),
                velocity: velocity
            },
            // Constrain the current offset to the bounds
            pos = me.constrainToBounds(offset),
            bounce = me.bounce = {};

        
        me.decelerating = true;
        me.bouncing = {x: false, y: false};
        
        if (me.bounces) {
            if (me.bounces.horizontal && pos.x != offset.x) {
                bounce.horizontal = {
                    startTime: currentTime - ((1 / me.springTension) * me.acceleration),
                    startOffset: pos.x,
                    velocity: (offset.x - pos.x) * me.springTension * Math.E
                };
                velocity.x = 0;
                me.bouncing.x = true;                
            }
            if (me.bounces.vertical && pos.y != offset.y) {
                bounce.vertical = {
                    startTime: currentTime - ((1 / me.springTension) * me.acceleration),
                    startOffset: pos.y,
                    velocity: (offset.y - pos.y) * me.springTension * Math.E
                };
                velocity.y = 0;
                me.bouncing.y = true;
            }
        }

        me.animating = true;
        me.decelerating = true;
        
        me.scrollInterval = setInterval(function() {
            me.handleScrollFrame();
        }, 1000 / this.fps);
    },

    // @private
    handleScrollFrame : function() {        
        // Instantly set up the timer for the next frame
        var me = this,
            deceleration = me.deceleration,
            bounce = me.bounce = me.bounce || {},
            offset = me.offset,

            currentTime = (new Date()).getTime(),
            deltaTime = (currentTime - deceleration.startTime),
            powFriction = Math.pow(me.omega, deltaTime / me.acceleration),

            currentVelocity = {
                x: deceleration.velocity.x * powFriction,
                y: deceleration.velocity.y * powFriction
            },

            newPos = {x: offset.x, y: offset.y},
            deltaOffset = {},
            powTime, startOffset, boundsPos;

        if (Math.abs(currentVelocity.x) < 1 && Math.abs(currentVelocity.y) < 1) {
            me.decelerating = false;
        }

        if (!bounce.horizontal && Math.abs(currentVelocity.x) >= 1) {
            deltaOffset.x = (
                (deceleration.velocity.x / deceleration.logFriction) -
                (deceleration.velocity.x * (powFriction / deceleration.logFriction))
            );
            newPos.x = deceleration.startOffset.x - deltaOffset.x;
        }

        if (!bounce.vertical && Math.abs(currentVelocity.y) >= 1) {
            deltaOffset.y = (
                (deceleration.velocity.y / deceleration.logFriction) -
                (deceleration.velocity.y * (powFriction / deceleration.logFriction))
            );
            newPos.y = deceleration.startOffset.y - deltaOffset.y;
        }

        boundsPos = me.constrainToBounds(newPos);

        if (boundsPos.x != newPos.x) {
            if (me.bounces && me.bounces.horizontal) {
                if (!bounce.horizontal) {
                    bounce.horizontal = {
                        startTime: currentTime,
                        startOffset: boundsPos.x,
                        velocity: currentVelocity.x
                    };
                    me.bouncing.x = true;
                }
            }
            else {
                newPos.x = boundsPos.x;
            }
            deceleration.velocity.x = 0;
        }

        if (boundsPos.y != newPos.y) {
            if (me.bounces && me.bounces.vertical) {
                if (!bounce.vertical) {
                    bounce.vertical = {
                        startTime: currentTime,
                        startOffset: boundsPos.y,
                        velocity: currentVelocity.y
                    };
                    me.bouncing.y = true;
                }
            }
            else {
                newPos.y = boundsPos.y;
            }
            deceleration.velocity.y = 0;
        }

        if (bounce.horizontal && bounce.horizontal.startTime != currentTime) {
            deltaTime = (currentTime - bounce.horizontal.startTime);
            powTime = (deltaTime / me.acceleration) * Math.pow(Math.E, -me.springTension * (deltaTime / me.acceleration));
            deltaOffset.x = bounce.horizontal.velocity * powTime;
            startOffset = bounce.horizontal.startOffset;

            if (Math.abs(deltaOffset.x) <= 1) {
                deltaOffset.x = 0;
                delete bounce.horizontal;
            }
            newPos.x = startOffset + deltaOffset.x;
        }

        if (bounce.vertical && bounce.vertical.startTime != currentTime) {
            deltaTime = (currentTime - bounce.vertical.startTime);
            powTime = (deltaTime / me.acceleration) * Math.pow(Math.E, -me.springTension * (deltaTime / me.acceleration));
            deltaOffset.y = bounce.vertical.velocity * powTime;
            startOffset = bounce.vertical.startOffset;

            if (Math.abs(deltaOffset.y) <= 1) {
                deltaOffset.y = 0;
                delete bounce.vertical;
            }
            newPos.y = startOffset + deltaOffset.y;
        }

        if (!bounce.vertical && !bounce.horizontal) {
            me.bouncing = {x: false, y: false};
        }

        me._scrollTo(newPos);
        
        if ((!me.bounces || (!me.bouncing.x && !me.bouncing.y)) && !me.decelerating) {
            clearInterval(me.scrollInterval);
            me.animating = false;
            me.snapToBounds(false);
            if (!this.animating) {
                me.doScrollEnd();
            }            
            return;
        }        
    },

    setSnap : function(snap) {
        this.snap = snap;
    },
    
    // @private
    snapToBounds : function(animate, easing) {
        var me = this,
            pos = me.constrainToBounds(me.offset);
            
        if (me.snap) {
            if (me.snap === true) {
                me.snap = {
                    x: 50,
                    y: 50
                };
            }
            else if (Ext.isNumber(me.snap)) {
                me.snap = {
                    x: me.snap,
                    y: me.snap
                };
            }
            if (me.snap.y) {
                pos.y = Math.round(pos.y / me.snap.y) * me.snap.y;
            }
            if (me.snap.x) {
                pos.x = Math.round(pos.x / me.snap.x) * me.snap.x;
            }
        }

        if (pos.x != me.offset.x || pos.y != me.offset.y) {
            if (me.snap) {
                me.scrollTo({x: -pos.x, y: -pos.y}, me.snapDuration, 'ease-in-out');
            }
            else if (animate) {
                me.applyVelocity();
            }
            else {
                me._scrollTo(pos);
            }
        }
    },

    // @private
    updateBounds : function(scrollIntoView) {
        var me = this;
        
        me.parentSize = {
            width: me.parent.getWidth(true),
            height: me.parent.getHeight(true)
        };

        me.contentSize = {
            width: me.scroller.dom.scrollWidth,
            height: me.scroller.dom.scrollHeight
        };

        // Get the scrollable view size
        me.size = {
            width: Math.max(me.contentSize.width, me.parentSize.width),
            height: Math.max(me.contentSize.height, me.parentSize.height)
        };

        // Determine the boundaries that we can drag between
        me.bounds = {
            x: me.parentSize.width - me.size.width,
            y: me.parentSize.height - me.size.height
        };        

        /**
         * Below, we check if we're scrolled past the dimensions of the container.
         * If the content size changes, say, all the items being removed from a list
         * we need to truncate the scroller.
         */        
        if (scrollIntoView) {
            if (this.scrollTo(me.getOffset()) !== false) {
                me.doScrollEnd();
            }            
        }
        
        if (me.scrollbarX) {
            me.scrollbarX.update();
        }
        
        if (me.scrollbarY) {
            me.scrollbarY.update();
        }
    },

    // @private
    constrainToBounds : function(pos) {
        if (!this.bounds) {
            this.updateBounds();
        }
        return {
            x: Math.min(Math.max(this.bounds.x, pos.x), 0),
            y: Math.min(Math.max(this.bounds.y, pos.y), 0)
        };
    },

    // @private
    resetMomentum : function(e) {
        this.momentumPoints = [];
        if (e) {
            this.addMomentum(e);
        }
    },

    // @private
    addMomentum : function(e) {
        var me = this;
        me.validateMomentum(e);
        me.momentumPoints.push({
            time: e.time,
            offset: {x: me.offset.x, y: me.offset.y}
        });  
    },

    // @private
    validateMomentum : function(e) {
        var momentum = this.momentumPoints,
            time = e.time;

        while (momentum.length) {
            if (time - momentum[0].time <= this.momentumResetTime) {
                break;
            }
            momentum.shift();
        }        
    },

    destroy : function() {
        var me = this;
        
        me.scroller.removeClass('x-scroller');
        me.parent.removeClass('x-scroller-parent');

        me.parent.un({
            touchstart: me.onTouchStart,
            scrollstart: me.onScrollStart,
            scrollend: me.onScrollEnd,
            scroll: me.onScroll,
            horizontal: me.horizontal,
            vertical: me.vertical,
            scope: me
        });

        clearInterval(me.scrollInterval);

        if (me.scrollbars) {
            if (me.horizontal) {
                me.scrollbarX.destroy();
            }

            if (me.vertical) {
                me.scrollbarY.destroy();
            }
        }

        me.scroller.un({
            'DOMSubtreeModified': me.updateBounds,
            'webkitTransitionEnd': me.onTransitionEnd,
            scope: me
        });
        
        Ext.ScrollManager.unregister(this);
    }
});

Ext.ScrollManager = new Ext.AbstractManager();

/**
 * @class Ext.util.Scroller.Scrollbar
 * @extends Object
 * @private
 */
Ext.util.Scroller.Scrollbar = Ext.extend(Object, {
    minSize: 4,
    size: 0,
    offset: 10,

    translateOpen: (Ext.is.Android || Ext.is.Blackberry)  ? 'translate(' : 'translate3d(',
    translateClose: (Ext.is.Android || Ext.is.Blackberry) ? ')' : ', 0px)',
    
    /**
     * @constructor
     * @private
     * @param {Ext.util.Scroller} scroller
     * @param {String} direction 'vertical' or 'horizontal'
     */
    constructor : function(scroller, direction) {
        var me = this;
        
        me.scroller = scroller;
        me.container = scroller.parent;
        me.direction = direction;
        me.bar = me.container.createChild({
            cls: 'x-scrollbar x-scrollbar-' + direction + ' x-scrollbar-' + scroller.ui
        });
        me.bar.on('webkitTransitionEnd', this.onTransitionEnd, this);
        me.hide();
    },

    destroy : function() {
        this.bar.un('webkitTransitionEnd', this.onTransitionEnd, this);
        this.bar.remove();
    },

    // @private
    update : function() {
        var me = this,
            scroller = me.scroller,
            contentSize = scroller.contentSize,
            parentSize = scroller.parentSize,
            size = scroller.size,
            height, width;
            
        if (me.direction == 'vertical') {
            // make sure the scrollbar only shows when the content is higher then the parent
            if (contentSize.height > parentSize.height) {
                me.size = Math.round((parentSize.height * parentSize.height) / size.height);
                me.autoShow = true;
            }
            else {
                me.autoShow = false;
            }
        }
        else {
            if (contentSize.width > parentSize.width) {
                me.size = Math.round((parentSize.width * parentSize.width) / size.width);
                me.autoShow = true;
            }
            else {
                me.autoShow = false;
            }
        }
    },
    
    // @private
    scrollTo : function(pos, animate, easing) {
        var me = this,
            scroller = me.scroller,
            style = me.bar.dom.style,
            transformX = 0,
            transformY = 0,
            size = me.size,
            boundsPos;

        if (!me.autoShow) {
            return;
        }
        
        if (me.hideTimeout) {
            clearTimeout(me.hideTimeout);
            me.hideTimeout = null;
        }
        
        if (me.hidden) {
            me.show();
        }

        if (me.direction == 'horizontal') {
            if (scroller.bouncing && scroller.bouncing.x) {
                boundsPos = scroller.constrainToBounds(pos);
                size = Math.max(size - Math.abs(pos.x - boundsPos.x), me.minSize);
                if (pos.x >= 0) {
                    transformX = boundsPos.x + me.offset;
                }
                else  {
                    transformX = scroller.parentSize.width - size - me.offset;
                }
                style.width = size + 'px';
                me.resized = true;
            }
            else {
                transformX = ((scroller.parentSize.width - size - (me.offset * 2)) / scroller.bounds.x * scroller.offset.x) + me.offset;
                if (me.resized == undefined || me.resized) {
                    style.width = size + 'px';
                    me.resized = false;
                }
            }
        }
        else {
            if (scroller.bouncing && scroller.bouncing.y) {
                boundsPos = scroller.constrainToBounds(pos);
                size = Math.max(size - Math.abs(pos.y - boundsPos.y), me.minSize);
                if (pos.y >= 0) {
                    transformY = boundsPos.y + me.offset;
                }
                else {
                    transformY = scroller.parentSize.height - size - me.offset;
                }
                style.height = size + 'px';
                me.resized = true;
            }
            else {
                transformY = ((scroller.parentSize.height - size - (me.offset * 2)) / scroller.bounds.y * scroller.offset.y) + me.offset;
                if (me.resized == undefined || me.resized) {
                    style.height = size + 'px';
                    me.resized = false;
                }
            }
        }

        if (animate) {
            style.webkitTransitionDuration = (typeof animate == 'number' ? animate : scroller.scrollToDuration) + 'ms, 0ms';
            style.webkitTransitionTimingFunction = easing;
            me.inTransition = true;
        }
        else {
            style.webkitTransitionDuration = '';
            me.inTransition = false;
        }
        style.webkitTransform = me.translateOpen + transformX + 'px, ' + transformY + 'px' + this.translateClose;
    },

    /**
     * Hide the scrollbar
     * @private
     */
    hide : function(delay) {
        var me = this;        
        if (delay) {
            me.hideTimeout = setTimeout(function() {
                me.bar.setStyle('opacity', '0');
                me.hidden = true;
                me.hideTimeout = null;           
            }, 1000);
        }
        else {
            me.bar.setStyle('opacity', '0');
            me.hidden = true;
        }
    },

    /**
     * Show the scrollbar
     * @private
     */
    show : function() {
        this.bar.setStyle('opacity', '1');
        this.hidden = false;
    },

    onTransitionEnd: function() {
        this.inTransition = false;
    },
    
    /**
     * Stop the scrollbar animation
     * @private
     */
    stop : function() {
        var me = this,
            style = me.bar.dom.style,
            transform;

        if (this.inTransition) {
            style.webkitTransitionDuration = '';
            transform = new WebKitCSSMatrix(window.getComputedStyle(me.bar.dom).webkitTransform);
            style.webkitTransform = me.translateOpen + transform.m41 + 'px, ' + transform.m42 + 'px' + me.translateClose;
        }
    }
});