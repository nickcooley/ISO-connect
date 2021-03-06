describe("Ext.form.EmailField", function() {
    var field;
    
    beforeEach(function() {
        field = new Ext.form.EmailField({
            label: 'test'
        });
    });
    
    afterEach(function() {
        field.destroy();
    });
    
    it("should have a inputType", function() {
        expect(field.inputType).toEqual('email');
    });
    
    it("should not autoCapitalize", function() {
        expect(field.autoCapitalize).toBeFalsy();
    });
});