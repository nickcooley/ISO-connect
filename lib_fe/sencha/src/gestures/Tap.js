Ext.gesture.Tap = Ext.extend(Ext.gesture.Gesture, {
    handles: [
        'tapstart',
        'tapcancel',
        'tap', 
        'doubletap', 
        'taphold',
        'singletap'
    ],
    
    cancelThreshold: 5,
    doubleTapThreshold: 800,
    singleTapThreshold: 400,
    holdThreshold : 1000,
    
    onTouchStart : function(e, touch) {
        var me = this;
        
        me.startX = touch.pageX;
        me.startY = touch.pageY;
        me.fire('tapstart', e, me.getInfo(touch));
        
        if (this.listeners.taphold) {    
            me.timeout = setTimeout(function() {
                me.fire('taphold', e, me.getInfo(touch));
                delete me.timeout;
            }, me.holdThreshold);            
        }
        
        me.lastTouch = touch;
    },
    
    onTouchMove : function(e, touch) {
        var me = this;
        if (me.isCancel(touch)) {
            me.fire('tapcancel', e, me.getInfo(touch));
            if (me.timeout) {
                clearTimeout(me.timeout);
                delete me.timeout;
            }
            me.stop();
        }
        
        me.lastTouch = touch;
    },
    
    onTouchEnd : function(e) {
        var me = this,
            info = me.getInfo(me.lastTouch);
        
        me.fire('tap', e, info);
        
        if (me.lastTapTime && e.timeStamp - me.lastTapTime <= me.doubleTapThreshold) {
            me.lastTapTime = null;
            e.preventDefault();
            me.fire('doubletap', e, info);
        }
        else {
            me.lastTapTime = e.timeStamp;
        }
        
        if (me.listeners.singletap && me.singleTapThreshold && !me.preventSingleTap) {
            me.fire('singletap', e, info);
            me.preventSingleTap = true;
            setTimeout(function() {
                me.preventSingleTap = false;
            }, me.singleTapThreshold);
        }
        
        if (me.timeout) {
            clearTimeout(me.timeout);
            delete me.timeout;
        }
    },
    
    getInfo : function(touch) {
        return {
            pageX: touch.pageX,
            pageY: touch.pageY
        };
    },
    
    isCancel : function(touch) {
        var me = this;
        return (
            Math.abs(touch.pageX - me.startX) >= me.cancelThreshold ||
            Math.abs(touch.pageY - me.startY) >= me.cancelThreshold
        );
    }
});
Ext.regGesture('tap', Ext.gesture.Tap);