Ext.gesture.Touch = Ext.extend(Ext.gesture.Gesture, {
    handles: ['touchstart', 'touchmove', 'touchend', 'touchdown'],
    
    touchDownInterval: 500,
    
    onTouchStart: function(e, touch) {
        var me = this;
        me.startX = me.previousX = touch.pageX;
        me.startY = me.previousY = touch.pageY;
        me.startTime = me.previousTime = e.timeStamp;

        me.fire('touchstart', e);
        me.lastEvent = e;
        
        if (me.listeners.touchdown) {
            me.touchDownIntervalId = setInterval(Ext.createDelegate(me.touchDownHandler, me), me.touchDownInterval);
        }
    },
    
    onTouchMove: function(e, touch) {
        this.fire('touchmove', e, this.getInfo(touch));
        this.lastEvent = e;
    },
    
    onTouchEnd: function(e) {
        this.fire('touchend', e, this.lastInfo);
        clearInterval(this.touchDownIntervalId);
    },
    
    touchDownHandler : function() {
        this.fire('touchdown', this.lastEvent, this.lastInfo);
    },
    
    getInfo : function(touch) {
        var me = this,
            startX = me.startX,
            startY = me.startY,
            previousX = me.previousX,
            previousY = me.previousY,
            pageX = touch.pageX,
            pageY = touch.pageY,
            deltaX = pageX - startX,
            deltaY = pageY - startY,
            startTime = me.startTime,
            previousTime = me.previousTime,
            time = (new Date()).getTime(),
            info = {
                startX: startX,
                startY: startY,
                previousX: previousX,
                previousY: previousY,
                pageX: pageX,
                pageY: pageY,
                deltaX: deltaX,
                deltaY: deltaY,
                absDeltaX: Math.abs(deltaX),
                absDeltaY: Math.abs(deltaY),
                previousDeltaX: pageX - previousX,
                previousDeltaY: pageY - previousY,
                time: time,
                startTime: startTime,
                previousTime: previousTime,
                deltaTime: time - startTime,
                previousDeltaTime: time - previousTime
            };
        
        me.previousTime = info.time;
        me.previousX = info.pageX;
        me.previousY = info.pageY;
        me.lastInfo = info;
        
        return info;
    }
});
Ext.regGesture('touch', Ext.gesture.Touch);