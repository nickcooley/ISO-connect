describe("Ext.util.Draggable", function() {
    var createDraggable, draggable, btn, e, panel,
        proto  = Ext.util.Draggable.prototype,
        called = false;
    
    beforeEach(function() {
        btn = new Ext.Button({
            text    : 'Button',
            renderTo: Ext.getBody()
        });
        
        createDraggable = function(config) {
            return new Ext.util.Draggable(btn.el, config);
        };
    });
    
    afterEach(function() {
        e = {};
        called = false;
        
        btn.destroy();
        if (draggable && draggable.destroy) draggable.destroy();
    });
    
    it("should have a baseCls", function() {
        expect(proto.baseCls).toEqual('x-draggable');
    });
    
    it("should have a draggingCls", function() {
        expect(proto.draggingCls).toEqual('x-dragging');
    });
    
    it("should have a proxyCls", function() {
        expect(proto.proxyCls).toEqual('x-draggable-proxy');
    });
    
    it("should have a direction", function() {
        expect(proto.direction).toEqual('both');
    });
    
    it("should have no delay", function() {
        expect(proto.delay).toEqual(0);
    });
    
    it("should have no cancelSelector", function() {
        expect(proto.cancelSelector).toBeNull();
    });
    
    it("should not be disabled", function() {
        expect(proto.disabled).toBeFalsy();
    });
    
    it("should not revert", function() {
        expect(proto.revert).toBeFalsy();
    });
    
    it("should constrain to the window", function() {
        expect(proto.constrain).toEqual(window);
    });
    
    it("should have a group", function() {
        expect(proto.group).toEqual('base');
    });
    
    it("should not be dragging", function() {
        expect(proto.isDragging()).toBeFalsy();
    });
    
    it("should not be isVertical()", function() {
        expect(proto.isVertical()).toBeFalsy();
    });
    
    it("should not be isHorizontal()", function() {
        expect(proto.isHorizontal()).toBeFalsy();
    });
    
    it("should not have a threshold", function() {
        expect(proto.threshold).toEqual(0);
    });
    
    describe("constructor", function() {
        it("should set the el", function() {
            draggable = createDraggable();
            
            expect(draggable.el).toEqual(btn.el);
        });
        
        describe("direction", function() {
            it("none", function() {
                draggable = createDraggable();
                
                expect(draggable.isHorizontal()).toBeTruthy();
                expect(draggable.isVertical()).toBeTruthy();
            });
            
            it("both", function() {
                draggable = createDraggable({
                    direction: 'both'
                });
                
                expect(draggable.isHorizontal()).toBeTruthy();
                expect(draggable.isVertical()).toBeTruthy();
            });
            
            it("horizontal", function() {
                draggable = createDraggable({
                    direction: 'horizontal'
                });
                
                expect(draggable.isHorizontal()).toBeTruthy();
                expect(draggable.isVertical()).toBeFalsy();
            });
            
            it("vertical", function() {
                draggable = createDraggable({
                    direction: 'vertical'
                });
                
                expect(draggable.isHorizontal()).toBeFalsy();
                expect(draggable.isVertical()).toBeTruthy();
            });
        });
        
        it("should add the baseCls to the el", function() {
            expect(btn.el.hasCls(proto.baseCls)).toBeFalsy();
            
            draggable = createDraggable();
            
            expect(draggable.el.hasCls(draggable.baseCls)).toBeTruthy();
            expect(btn.el.hasCls(draggable.baseCls)).toBeTruthy();
        });
        
        describe("startEventName", function() {
            describe("when delay > 0", function() {
                it("taphold", function() {
                    draggable = createDraggable({
                        delay: 400
                    });
                    
                    expect(draggable.startEventName).toEqual('taphold');
                });
            });
            
            describe("when delay == 0", function() {
                it("dragstart", function() {
                    draggable = createDraggable();
                    
                    expect(draggable.startEventName).toEqual('dragstart');
                });
            });
        });
    });
    
    describe("onStart", function() {
        beforeEach(function() {
            e = {
                browserEvent: {
                    preventDefault : function() {},
                    stopPropagation: function() {}
                },
                getTarget: function(v) {
                    if (v == 'cancelSelector') return true;
                    return false;
                },
                type     : 'tapstart',
                deltaType: 0
            };
        });
        // 
        // describe("when android", function() {
        //     beforeEach(function() {
        //         Ext.is.Android = true;
        //         
        //         draggable = createDraggable();
        //     });
        //     
        //     it("it should call e.browserEvent.preventDefault", function() {
        //         var spy = spyOn(e.browserEvent, "preventDefault");
        //         
        //         draggable.onTapEvent(e);
        //         
        //         expect(spy).wasCalled();
        //     });
        //     
        //     it("it should call e.browserEvent.stopPropagation", function() {
        //         var spy = spyOn(e.browserEvent, "stopPropagation");
        //         
        //         draggable.onTapEvent(e);
        //         
        //         expect(spy).wasCalled();
        //     });
        // });
        
        describe("cancelSelector", function() {
            describe("when cancelSelector and found", function() {
                it("should not continue", function() {
                    draggable = createDraggable({
                        cancelSelector: 'cancelSelector'
                    });
                    
                    draggable.onStart(e);
                });
            });
            
            describe("when no cancelSelector and not found", function() {
                it("should continue", function() {
                    draggable = createDraggable({
                        cancelSelector: false
                    });
                    
                    draggable.onStart(e);
                });
            });
        });
    });
    
    describe("prepareDrag", function() {
        beforeEach(function() {
            e = {
                pageX: 0,
                pageY: 0
            };
            
            draggable = createDraggable();
        });
        
        it("should call reset", function() {
            var spy = spyOn(draggable, "reset");
            
            draggable.prepareDrag(e);
            
            expect(spy).wasCalled();
        });
        
        describe("constrain", function() {
            describe("when window", function() {
                it("should create a constrainRegion", function() {
                    draggable.prepareDrag(e);
                    
                    expect(draggable.constrainRegion.top).toEqual(0);
                    expect(draggable.constrainRegion.right).toEqual(window.innerWidth);
                    expect(draggable.constrainRegion.bottom).toEqual(window.innerHeight);
                    expect(draggable.constrainRegion.left).toEqual(0);
                });
            });
            
            describe("when el", function() {
                beforeEach(function() {
                    draggable.destroy();
                    
                    panel = new Ext.Panel({
                        width : 500,
                        height: 300,
                        
                        renderTo: Ext.getBody()
                    });
                    
                    draggable = createDraggable({
                        constrain: panel.el
                    });
                });
                
                afterEach(function() {
                    panel.destroy();
                });
                
                it("should create a constrainRegion", function() {
                    draggable.prepareDrag(e);
                    
                    expect(draggable.constrainRegion).toBeDefined();
                });
            });
        });
        
        it("should create startRegion", function() {
            draggable.prepareDrag(e);
            
            expect(draggable.startRegion).toBeDefined();
        });
        
        it("should create offsetToCorner", function() {
            draggable.prepareDrag(e);
            
            expect(draggable.offsetToCorner).toBeDefined();
        });
    });
    
    describe("onDragStart", function() {
        beforeEach(function() {
            e = {
                pageX: 0,
                pageY: 0
            };
            
            draggable = createDraggable();
        });
        
        it("should call prepareDrag", function() {
            var spy = spyOn(draggable, "prepareDrag");
            
            draggable.onDragStart(e);
            
            expect(spy).wasCalled();
        });
        
        it("should add the dragCls to el", function() {
            expect(draggable.el.hasCls(draggable.dragCls)).toBeFalsy();
            
            draggable.onDragStart(e);
            
            expect(draggable.el.hasCls(draggable.dragCls)).toBeTruthy();
        });
        
        it("should set dragging = true", function() {
            expect(draggable.isDragging).toBeFalsy();
            
            draggable.onDragStart(e);
            
            expect(draggable.isDragging).toBeTruthy();
        });
        
        it("should fire a dragstart event", function() {
            var fired = false;
            
            draggable.on({
                dragstart: function() { fired = true; }
            });
            
            draggable.onDragStart(e);
            
            expect(fired).toBeTruthy();
        });
    });
    
    describe("onTouchMove", function() {
        beforeEach(function() {
            e = {
                pageX    : 0,
                pageY    : 0,
                deltaX   : 10,
                deltaY   : 10
            };
            
            draggable = createDraggable({
                canDrag: true
            });
        });
        
        describe("when !canDrag", function() {
            it("should return", function() {
                draggable.canDrag = false;
                draggable.onTouchMove(e);
            });
        });
        
        describe("when !dragging", function() {
            beforeEach(function() {
                draggable.isDragging = false;
            });
            
            it("should call onDragStart", function() {
                var spy = spyOn(draggable, "onDragStart").andCallThrough();
                
                draggable.onTouchMove(e);
                
                expect(spy).wasCalled();
            });
            
            it("should return", function() {
                draggable.threshold = 1000;
                draggable.onTouchMove(e);
            });
        });
        
        describe("when horizontal", function() {
            beforeEach(function() {
                draggable.horizontal = true;
                draggable.vertical   = false;
            });
            
            it("should call transformTo ", function() {
                var spy = spyOn(draggable, "transformTo");
                
                draggable.onTouchMove(e);
                
                expect(spy).wasCalled();
            });
        });
        
        describe("when vertical", function() {
            beforeEach(function() {
                draggable.horizontal = false;
                draggable.horizontal = true;
            });
            
            it("should call transformTo ", function() {
                var spy = spyOn(draggable, "transformTo");
                
                draggable.onTouchMove(e);
                
                expect(spy).wasCalled();
            });
        });
        
        it("should fire the drag event", function() {
            var fired = false;
            
            draggable.on({
                drag: function() { fired = true; }
            });
            
            draggable.onTouchMove(e);
            
            expect(fired).toBeTruthy();
        });
    });
    
    describe("moveTo", function() {
        beforeEach(function() {
            draggable = createDraggable({
                canDrag: true
            });
        });
        
        it("should call transformTo", function() {
            var spy = spyOn(draggable, "transformTo");
            
            draggable.moveTo(0, 0);
            
            expect(spy).wasCalled();
        });
    });
    
    describe("onTouchEnd", function() {
        beforeEach(function() {
            e = {
                pageX    : 0,
                pageY    : 0,
                deltaX   : 10,
                deltaY   : 10,
                stopEvent: function() { called = true; }
            };
            
            draggable = createDraggable({
                canDrag : true,
                dragging: true
            });
        });
        
        it("should make canDrag false", function() {
            expect(draggable.canDrag).toBeTruthy();
            
            draggable.onTouchEnd(e);
            
            expect(draggable.canDrag).toBeFalsy();
        });
        
        it("should make dragging false", function() {
            expect(draggable.isDragging).toBeTruthy();
            
            draggable.onTouchEnd(e);
            
            expect(draggable.isDragging).toBeFalsy();
        });
        
        it("should fire a beforedragend event", function() {
            var fired = false;
            
            draggable.on({
                beforedragend: function() { fired = true; }
            });
            
            draggable.onTouchEnd(e);
            
            expect(fired).toBeTruthy();
        });
    });
    
    describe("enable", function() {
        beforeEach(function() {
            draggable = createDraggable();
        });
        
        it("should not be disabled", function() {
            draggable.enable();
            
            expect(draggable.isDisabled()).toBeFalsy();
        });
    });
    
    describe("disable", function() {
        beforeEach(function() {
            draggable = createDraggable();
        });
        
        it("should be disabled", function() {
            draggable.disable();
            
            expect(draggable.isDisabled()).toBeTruthy();
        });
    });
});
