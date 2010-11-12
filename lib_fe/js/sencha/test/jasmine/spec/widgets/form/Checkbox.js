describe("Ext.form.Checkbox", function() {
    var cb;
    
    beforeEach(function() {
        cb = new Ext.form.Checkbox({
            label: 'test'
        });
    });
    
    afterEach(function() {
        cb.destroy();
    });
    
    it("should have a inputType", function() {
        expect(cb.inputType).toEqual('checkbox');
    });
    
    it("should have a ui", function() {
        expect(cb.ui).toEqual('checkbox');
    });
    
    it("should not be checked", function() {
        expect(cb.checked).toBeFalsy();
    });
    
    it("should have no inputValue", function() {
        expect(cb.inputValue).not.toBeDefined();
    });
    
    it("should have a renderTpl", function() {
        expect(cb.renderTpl).toBeDefined();
    });
    
    describe("on getValue", function() {
        it("should return the value", function() {
            expect(cb.getValue()).toBeFalsy();
        });
    });
    
    describe("on setValue", function() {
        it("should set the value", function() {
            cb.setValue(1);
            
            expect(cb.checked).toBeTruthy();
        });
        
        it("should call onChange", function() {
            var spy = spyOn(cb, "onChange").andCallThrough();
            
            cb.setValue(1);
            
            expect(spy).wasCalled();
        });
    });
    
    describe("on render", function() {
        it("should call setValue", function() {
            var spy = spyOn(cb, "setValue").andCallThrough();
            
            cb.render(Ext.getBody());
            
            expect(spy).wasCalled();
        });
    });
    
    describe("after render", function() {
        beforeEach(function() {
            cb.render(Ext.getBody());
        });
        
        describe("on onChange", function() {
            it("should fire a check event", function() {
                var fired = false;
                
                cb.on({
                    check: function() {
                        fired = true;
                    }
                });
                
                cb.onChange();
            });
        });
        
        describe("on getValue", function() {
            it("should return the value", function() {
                expect(cb.getValue()).toBeFalsy();
            });
        });
        
        describe("on setValue", function() {
            it("should update the dom", function() {
                cb.setValue(1);

                expect(cb.fieldEl.dom.checked).toBeTruthy();
            });
        });
    });
});