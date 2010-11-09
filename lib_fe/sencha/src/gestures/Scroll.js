Ext.gesture.Scroll = Ext.extend(Ext.gesture.Touch, {
    handles: ['scrollstart', 'scroll', 'scrollend'],
    
    scrollThreshold: 35,
    horizontal: true,
    vertical: true,
    
    onTouchStart : function(e, touch) {
        this.startX = this.previousX = touch.pageX;
        this.startY = this.previousY = touch.pageY;
        this.startTime = this.previousTime = e.timeStamp;
        this.scrolling = false;
    },    
    
    onTouchMove : function(e, touch) {
        var info = this.getInfo(touch);
        if (!this.scrolling) {
            if (this.isScrolling(info) && this.fire('scrollstart', e, info)) {
                this.scrolling = true;
                this.lock('scroll', 'scrollstart', 'scrollend');
            }
        }
        else {
            this.fire('scroll', e, info);
        }
    },

    onTouchEnd : function(e) {
        if (this.scrolling) {
            this.fire('scrollend', e, this.lastInfo);
        }
    },
    
    isScrolling : function(info) {
        return (
            (this.horizontal && info.absDeltaX >= this.scrollThreshold) ||
            (this.vertical && info.absDeltaY >= this.scrollThreshold)
        );
    }
});

Ext.regGesture('scroll', Ext.gesture.Scroll);