Ext.gesture.Manager = new Ext.AbstractManager({
    startEvent: 'touchstart',
    moveEvent: 'touchmove',
    endEvent: 'touchend',
    
    init : function() {
        this.targets = []; 

        if (!Ext.supports.Touch) {
            Ext.apply(this, {
                startEvent: 'mousedown',
                moveEvent: 'mousemove',
                endEvent: 'mouseup'
            });
        }
        
        this.followTouches = [];
        this.currentGestures = [];
        this.currentTargets = [];
        
        document.addEventListener(this.startEvent, this.onTouchStart, true);
        document.addEventListener(this.moveEvent, this.onTouchMove, false);
        document.addEventListener(this.endEvent, this.onTouchEnd, true);
        
        if (Ext.is.Blackberry) {
            document.addEventListener('mousedown', this.onMouseDown, false);
        }
    },
    
    onMouseDown : function(e) {
        e.stopPropagation();
        e.preventDefault();    
    },
    
    onTouchStart : function(e) {
        var me = Ext.gesture.Manager,
            targets = [],
            target;
        
        me.locks = {};
        
        target = e.target;
        
        me.currentTargets = [target];
        
        if (Ext.is.Android) {
            if (!(/input|select|textarea/i.test(target.tagName))) {
                e.preventDefault();
                e.stopPropagation();                
            }
        }
              
        while (target) {
            if (me.targets.indexOf(target) != -1) {
                targets.unshift(target);
            }
            target = target.parentNode;
            me.currentTargets.push(target);
        }
        
        me.startEvent = e;
        me.handleTargets(targets, e);
    },
    
    /**
     * This listener is here to always ensure we stop all current gestures
     * @private
     */    
    onTouchEnd : function(e) {
        var me = Ext.gesture.Manager,
            gestures = me.currentGestures.slice(0),
            ln = gestures.length,
            i, gesture;
            
        me.followTouches = [];
        me.startedChangedTouch = false;
        me.currentTargets = [];
        me.startEvent = null;
        
        for (i = 0; i < ln; i++) {
            gesture = gestures[i];
            if (!e.stopped && gesture.listenForEnd) {
                gesture.onTouchEnd(e, e.changedTouches ? e.changedTouches[0] : e);
            }
            me.stopGesture(gesture);
        }
    },
    
    /**
     * This listener is here to always ensure we cancel the global page scroll
     * @private
     */ 
    onTouchMove : function(e) {
        e.preventDefault();
    },

    startGesture : function(gesture) {
        var me = this;
        
        if (gesture.listenForMove) {
            gesture.onTouchMoveWrap = function(e) {
                if (!e.stopped) {
                    gesture.onTouchMove(e, e.changedTouches ? e.changedTouches[0] : e);   
                }
            };
            gesture.target.addEventListener(me.moveEvent, gesture.onTouchMoveWrap, !!gesture.capture);
        }
        
        this.currentGestures.push(gesture);
    },

    stopGesture : function(gesture) {
        if (gesture.listenForMove) {
            gesture.target.removeEventListener(this.moveEvent, gesture.onTouchMoveWrap, !!gesture.capture);
        }
        this.currentGestures.remove(gesture);
    },
    
    handleTargets : function(targets, e) {
        // In handle targets we have to first handle all the capture targets,
        // then all the bubble targets.
        var ln = targets.length,
            i, target;
        
        this.startedChangedTouch = false;
        this.startedTouches = Ext.supports.Touch ? e.touches : [e];

        for (i = 0; i < ln; i++) {
            if (e.stopped) {
                break;
            }
            target = targets[i];
            this.handleTarget(target, e, true);
        }
        
        for (i = ln - 1; i >= 0; i--) {
            if (e.stopped) {
                break;
            }
            target = targets[i];
            this.handleTarget(target, e, false);
        }
        
        if (this.startedChangedTouch) {
            this.followTouches = this.followTouches.concat(Ext.supports.Touch ? Ext.toArray(e.targetTouches) : [e]);
        }
    },
    
    handleTarget : function(target, e, capture) {
        var gestures = Ext.Element.data(target, 'x-gestures') || [],
            ln = gestures.length,
            i, gesture, changedTouch;


        for (i = 0; i < ln; i++) {
            gesture = gestures[i];
            if (
                (this.followTouches.length < gesture.touches) && 
                (Ext.supports.Touch ? (e.targetTouches.length === gesture.touches) : true) && 
                (!!gesture.capture === !!capture)
            ) {
                this.startedChangedTouch = true;
                if (gesture.listenForStart) {
                    gesture.onTouchStart(e, e.changedTouches ? e.changedTouches[0] : e);                
                }
                this.startGesture(gesture);
                if (e.stopped) {
                    break;
                }                
            }
        }
    },
        
    addEventListener : function(target, eventName, listener, options) {
        target = Ext.getDom(target);
        
        var targets = this.targets,
            name = this.getGestureName(eventName),
            gestures = Ext.Element.data(target, 'x-gestures') || [],
            gesture;
        
        // <debug>
        if (!name) {
            throw 'Trying to subscribe to unknown event ' + eventName;
        }
        // </debug>
        
        if (targets.indexOf(target) == -1) {
            this.targets.push(target);
        }
        
        gesture = this.get(target.id + '-' + name);
        
        if (!gesture) {
            gesture = this.create(Ext.apply({}, options || {}, {
                target: target,
                type: name
            })); 
            gestures.push(gesture);
            Ext.Element.data(target, 'x-gestures', gestures);
            
            // If there is already a finger down, then instantly start the gesture
            if (this.startedChangedTouch && this.currentTargets.contains(target)) {
                if (gesture.listenForStart) {
                    gesture.onTouchStart(this.startEvent, this.startedTouches[0]);                
                }
                this.startGesture(gesture);
            }
        }
        
        gesture.addListener(eventName, listener);
    },
    
    removeEventListener : function(target, eventName, listener) {
        target = Ext.getDom(target);
        
        var targets = this.targets,
            name = this.getGestureName(eventName),
            gestures = Ext.Element.data(target, 'x-gestures') || [],
            gesture;
            
        gesture = this.get(target.id + '-' + name);
        if (gesture) {
            gesture.removeListener(eventName, listener);
            if (!gesture.listeners) {
                gesture.destroy();
                gestures.remove(gesture);
                Ext.Element.data(target, 'x-gestures', gestures);
            }
        }
    },
    
    getGestureName : function(ename) {
        return this.names && this.names[ename];
    },
        
    registerType : function(type, cls) {
        var handles = cls.prototype.handles,
            i, ln;

        this.types[type] = cls;
        cls[this.typeName] = type;
        
        if (!handles) {
            handles = cls.prototype.handles = [type];
        }
        
        this.names = this.names || {};
        for (i = 0, ln = handles.length; i < ln; i++) {
            this.names[handles[i]] = type;
        }
    }
});

Ext.regGesture = function() {
    return Ext.gesture.Manager.registerType.apply(Ext.gesture.Manager, arguments);
};