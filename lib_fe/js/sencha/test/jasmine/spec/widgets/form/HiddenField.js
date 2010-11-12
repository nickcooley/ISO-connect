describe("Ext.form.HiddenField", function() {
    var field;
    
    beforeEach(function() {
        field = new Ext.form.HiddenField({
            label: 'test'
        });
    });
    
    afterEach(function() {
        field.destroy();
    });
    
    it("should have a inputType", function() {
        expect(field.inputType).toEqual('hidden');
    });
    
    it("should have a ui", function() {
        expect(field.ui).toEqual('hidden');
    });
    
    it("should have no focus method", function() {
        expect(field.focus).toEqual(Ext.emptyFn);
    });
});