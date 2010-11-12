describe("Ext.form.UrlField", function() {
    var field;
    
    beforeEach(function() {
        field = new Ext.form.UrlField({
            label: 'test'
        });
    });
    
    afterEach(function() {
        field.destroy();
    });
    
    it("should have a inputType", function() {
        expect(field.inputType).toEqual('url');
    });
    
    it("should not autoCapitalize", function() {
        expect(field.autoCapitalize).toBeFalsy();
    });
});