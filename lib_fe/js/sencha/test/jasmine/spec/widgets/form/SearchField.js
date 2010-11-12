describe("Ext.form.SearchField", function() {
    var field;
    
    beforeEach(function() {
        field = new Ext.form.SearchField({
            label: 'test'
        });
    });
    
    afterEach(function() {
        field.destroy();
    });
    
    it("should have an inputType", function() {
        expect(field.inputType).toEqual('search');
    });
});