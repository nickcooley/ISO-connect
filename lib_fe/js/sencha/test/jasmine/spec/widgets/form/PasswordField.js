describe("Ext.form.PasswordField", function() {
    var field;
    
    beforeEach(function() {
        field = new Ext.form.PasswordField({
            label: 'test'
        });
    });
    
    afterEach(function() {
        field.destroy();
    });
    
    it("should have a inputType", function() {
        expect(field.inputType).toEqual('password');
    });
    
    it("should not autoCapitalize", function() {
        expect(field.autoCapitalize).toBeFalsy();
    });
});