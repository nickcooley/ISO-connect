describe("Ext.form.Radio", function() {
    var field, fielda, fieldb, panel;
    
    beforeEach(function() {
        field = new Ext.form.Radio({
            label: 'test',
            name : 'radio'
        });
    });
    
    afterEach(function() {
        field.destroy();
    });
    
    it("should have an inputType", function() {
        expect(field.inputType).toEqual('radio');
    });
    
    it("should have a ui", function() {
        expect(field.ui).toEqual('radio');
    });
    
    describe("when rendered", function() {
        beforeEach(function() {
            field.render(Ext.getBody());
        });
        
        describe("when a group", function() {
            beforeEach(function() {
                panel = new Ext.form.FormPanel({
                    defaults: {
                        xtype: 'radio'
                    },
                    items: [
                        {
                            label: 'One',
                            name : 'one'
                        },
                        {
                            label: 'Two',
                            name : 'two'
                        }
                    ],
                    renderTo: Ext.getBody()
                });
                
                fielda = panel.items.get(0);
                fieldb = panel.items.get(1);
            });
            
            afterEach(function() {
                panel.destroy();
            });
            
            describe("on getGroupValue", function() {
                it("should not be null", function() {
                    fieldb.setValue(true);
                    expect(fieldb.getGroupValue()).not.toBeNull();
                });
            });
        });
        
        describe("on getCheckEl", function() {
            it("should return", function() {
                expect(field.getCheckEl()).toBeDefined();
                
                field.inGroup = true;
                expect(field.getCheckEl()).toBeDefined();
            });
        });
    });
});