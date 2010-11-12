describe("Ext.form.TextField", function() {
    var proto = Ext.form.TextField,
        field, e;
    
    beforeEach(function() {
        field = new Ext.form.TextField({
            label: 'test'
        });
    });
    
    afterEach(function() {
        e = null;
        field.destroy();
    });
    
    describe("onKeyUp", function() {
        describe("when browserevent is 13", function() {
            beforeEach(function() {
                e = {
                    browserEvent: {
                        keyCode: 13
                    }
                };
            });
            
            it("should call the blur method", function() {
                var spy = spyOn(field, "blur");
                
                field.onKeyUp(e);
                
                expect(spy).wasCalled();
            });
            
            it("should call Ext.Viewport.scrollToTop", function() {
                var spy = spyOn(Ext.Viewport, "scrollToTop");
                
                field.onKeyUp(e);
                
                expect(spy).wasCalled();
            });
        });
    });
});