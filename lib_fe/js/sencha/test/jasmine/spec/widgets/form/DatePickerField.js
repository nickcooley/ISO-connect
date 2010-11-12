describe("Ext.form.DatePickerField", function() {
    var proto = Ext.form.DatePickerField.prototype,
        field, makeField;
    
    beforeEach(function() {
        makeField = function(config) {
            field = new Ext.form.DatePickerField(Ext.apply({
                label   : 'Label',
                renderTo: Ext.getBody()
            }, config || {}));
        };
    });
    
    afterEach(function() {
        if (field) field.destroy();
    });
    
    it("should have a ui", function() {
        expect(proto.ui).toEqual('select');
    });
    
    it("should maskField", function() {
        expect(proto.maskField).toBeTruthy();
    });
    
    it("should have no picker", function() {
        expect(proto.picker).toBeNull();
    });
    
    describe("initComponent", function() {
        it("should still be set tabIndex", function() {
            makeField();
            
            expect(field.tabIndex).toEqual(-1);
        });
    });
    
    xdescribe("onTap", function() {
        describe("when disabled", function() {
            beforeEach(function() {
                makeField({
                    disabled: true
                });
            });
            
            it("should do nothing", function() {
                expect(field.datePicker).not.toBeDefined();
                
                field.onTap();
                
                expect(field.datePicker).not.toBeDefined();
            });
        });
        
        describe("when enabled", function() {
            describe("when no datePicker", function() {
                it("should create a new datePicker", function() {
                    makeField();
                    
                    expect(field.datePicker).not.toBeDefined();
                    
                    field.onTap();
                    
                    expect(field.datePicker).toBeDefined();
                });
                
                describe("when picker is set", function() {
                    it("should use the config", function() {
                        makeField({
                            picker: {
                                yearFrom: 1900
                            }
                        });

                        field.onTap();

                        expect(field.datePicker.yearFrom).toEqual(1900);
                    });
                    
                    describe("when using value", function() {
                        it("should do both", function() {
                            var value = {
                                day  : 1,
                                month: 5,
                                year : 1989
                            };

                            makeField({
                                value: value,
                                picker: {
                                    yearFrom: 1900
                                }
                            });

                            field.onTap();

                            expect(field.datePicker.yearFrom).toEqual(1900);
                            expect(field.datePicker.value).toEqual(value);
                        });
                    });
                });
                
                describe("when field has a value", function() {
                    it("should use the value", function() {
                        var value = {
                            day  : 1,
                            month: 5,
                            year : 1989
                        };
                        
                        makeField({
                            value: value
                        });

                        field.onTap();

                        expect(field.datePicker.value).toEqual(value);
                    });
                });
            });
        });
    });
    
    describe("setValue", function() {
        beforeEach(function() {
            makeField();
        });
        
        xdescribe("when no value", function() {
            it("should set the value to null", function() {
                field.setValue();
                
                expect(field.value).toBeNull();
                expect(field.getValue()).toBeNull();
                expect(field.getValue(true)).toBeNull();
            });
        });
        
        xdescribe("when string", function() {
            it("should set the value to null", function() {
                field.setValue('value');
                
                expect(field.value).toBeNull();
                expect(field.getValue()).toBeNull();
                expect(field.getValue(true)).toBeNull();
            });
        });
        
        xdescribe("when object", function() {
            it("should set the value to the object", function() {
                var values = {
                    day  : 1,
                    month: 5,
                    year : 1989
                };
                
                var date = new Date(values.year, values.month - 1, values.day);
                
                field.setValue(values);
                
                expect(field.value).toEqual(date);
                expect(field.getValue()).toEqual(date);
                expect(field.getValue(true)).toEqual(date.format(Ext.util.Format.defaultDateFormat));
            });
        });
        
        describe("when date", function() {
            it("should set the value to the object", function() {
                var values = {
                    day  : 1,
                    month: 5,
                    year : 1989
                };
                
                var date = new Date(values.year, values.month - 1, values.day);
                
                field.setValue(date);
                
                expect(field.value).toEqual(date);
                expect(field.getValue()).toEqual(date);
                expect(field.getValue(true)).toEqual(date.format(Ext.util.Format.defaultDateFormat));
            });
        });
    });
    
    describe("getValue", function() {
        describe("nothing", function() {
            beforeEach(function() {
                makeField();
            });
            
            it("should return null", function() {
                expect(field.getValue()).toBeNull();
            });
        });
        
        describe("value", function() {
            beforeEach(function() {
                makeField({
                    value: {
                        day  : 1,
                        month: 5,
                        year : 1989
                    }
                });
            });
            
            it("should return a date", function() {
                expect(Ext.isDate(field.getValue())).toBeTruthy();
            });
            
            it("should return a formatted date", function() {
                var result = field.getValue(true);
                expect(Ext.isDate(result)).toBeFalsy();
                expect(result).toEqual('05/01/1989');
            });
        });
    });
});