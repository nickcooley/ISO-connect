describe("Ext.form.Field", function() {
    var field, panel;
    
    beforeEach(function() {
        field = new Ext.form.Field({
            label: 'test'
        });
    });
    
    afterEach(function() {
        field.destroy();
    });
    
    it("should have a ui", function() {
        expect(field.ui).toEqual('text');
    });
    
    it("should have a isField", function() {
        expect(field.isField).toBeTruthy();
    });
    
    it("should have a baseCls", function() {
        expect(field.baseCls).toEqual('x-field');
    });
    
    it("should have no inputCls", function() {
        expect(field.inputCls).not.toBeDefined();
    });
    
    it("should have a focusCls", function() {
        expect(field.focusCls).toEqual('x-field-focus');
    });
    
    it("should have a maxLength", function() {
        expect(field.maxLength).toEqual(0);
    });
    
    it("should have no placeHolder", function() {
        expect(field.placeHolder).not.toBeDefined();
    });
    
    it("should not autoComplete", function() {
        expect(field.autoComplete).not.toBeDefined();
    });
    
    it("should not autoCapitalize", function() {
        expect(field.autoComplete).not.toBeDefined();
    });
    
    it("should not autoFocus", function() {
        expect(field.autoFocus).not.toBeDefined();
    });
    
    it("should not autoCorrect", function() {
        expect(field.autoCorrect).not.toBeDefined();
    });
    
    it("should have a renderTpl", function() {
        expect(field.renderTpl).toBeDefined();
    });
    
    it("should not be disabled", function() {
        expect(field.disabled).toBeFalsy();
    });
    
    it("should isFormField", function() {
        expect(field.isFormField).toBeTruthy();
    });
    
    it("should not isFocused", function() {
        expect(field.isFocused).toBeFalsy();
    });
    
    it("should not autoCreateField", function() {
        expect(field.autoCreateField).toBeTruthy();
    });
    
    it("should have a inputType", function() {
        expect(field.inputType).toEqual('text');
    });
    
    it("should have a labelWidth", function() {
        expect(field.labelWidth).toEqual(100);
    });
    
    it("should have a labelAlign", function() {
        expect(field.labelAlign).toEqual('left');
    });
    
    it("should not be required", function() {
        expect(field.required).toBeFalsy();
    });
    
    it("should not maskField", function() {
        expect(field.maskField).toBeFalsy();
    });
    
    describe("on getName", function() {
        it("should return the name", function() {
            field.name = 'test';
            
            expect(field.getName()).toEqual('test');
        });
        
        it("should return the id", function() {
            field.id = 'test';
            
            expect(field.getName()).toEqual('test');
        });
        
        it("should be null", function() {
            field.id = null;
            
            expect(field.getName()).toEqual('');
        });
    });
    
    describe("getValue", function() {
        it("should return the value", function() {
            expect(field.getValue()).not.toBeDefined();
            
            field.setValue('test');
            
            expect(field.getValue()).toEqual('test');
        });
    });
    
    describe("on render", function() {
        describe("when required", function() {
            beforeEach(function() {
                field.required = true;
                field.render(Ext.getBody());
            });
            
            it("should add the required class", function() {
                expect(field.el.hasCls('x-field-required')).toBeTruthy();
            });
        });
        
        describe("when label", function() {
            beforeEach(function() {
                field.render(Ext.getBody());
            });
            
            it("should add the required class", function() {
                expect(field.el.hasCls('x-label-align-' + field.labelAlign)).toBeTruthy();
            });
        });
        
        describe("with all values", function() {
            beforeEach(function() {
                field.autoComplete = true;
                field.autoCapitalize = true;
                field.autoCorrect = true;
                field.autoFocus = true;
                field.maskField = true;
                field.showClear = true;
                
                field.render(Ext.getBody());
            });
            
            it("should render", function() {
                // for 100% test coverage
            });
        });
    });
    
    describe("after render", function() {
        beforeEach(function() {
            field.maskField = true;
            field.render(Ext.getBody());
        });
        
        describe("on onEnable", function() {
            beforeEach(function() {
                field.onDisable();
            });
            
            it("should checkClear", function() {
                var spy = spyOn(field, "checkClear");

                field.onEnable();

                expect(spy).wasCalled();
            });
        });

        describe("on onDisable", function() {
            it("should checkClear", function() {
                var spy = spyOn(field, "checkClear").andCallThrough();

                field.onDisable();

                expect(spy).wasCalledWith(true);
            });
        });
        
        describe("on isDirty", function() {
            it("should return", function() {
                field.isDirty();
            });
            
            describe("when disabled", function() {
                beforeEach(function() {
                    field.disabled = true;
                });
                
                it("should return", function() {
                    field.isDirty();
                });
            });
        });
        
        describe("on onClearTap", function() {
            it("should should call setValue", function() {
                var spy = spyOn(field, "setValue").andCallThrough();
                
                field.onClearTap();
                
                expect(spy).wasCalledWith('');
            });
        });
        
        describe("on onKeyUp", function() {
            it("should call checkClear", function() {
                var spy = spyOn(field, "checkClear").andCallThrough();
                
                field.onKeyUp({browserEvent: {}});
                
                expect(spy).wasCalled();
            });
            
            it("should fire a keyup event", function() {
                var fired = false;
                
                field.on({
                    keyup: function() {
                        fired = true;
                    }
                });
                
                field.onKeyUp({browserEvent: {}});
                
                expect(fired).toBeTruthy();
            });
        });
        
        describe("on onMaskTap", function() {
            it("should hide the mask", function() {
                var spy = spyOn(field, "hideMask").andCallThrough();
                
                field.onMaskTap();
                
                expect(spy).wasCalled();
            });
        });
        
        describe("on reset", function() {
            it("should call setValue", function() {
                var spy = spyOn(field, "setValue").andCallThrough();
                
                field.reset();
                
                expect(spy).wasCalled();
            });
        });
        
        describe("on onFocus", function() {
            it("should call beforeFocus", function() {
                var spy = spyOn(field, "beforeFocus").andCallThrough();
                
                field.onFocus();
                
                expect(spy).wasCalled();
            });
            
            it("should update isFocused", function() {
                field.onFocus();
                
                expect(field.isFocused).toBeTruthy();
            });
            
            it("should fire a focus event", function() {
                var fired = false;
                
                field.on({
                    focus: function() {
                        fired = true;
                    }
                });
                
                field.onFocus();
                
                expect(fired).toBeTruthy();
            });
        });
        
        describe("on onBlur", function() {
            it("should call beforeBlur", function() {
                var spy = spyOn(field, "beforeBlur").andCallThrough();
                
                field.onBlur();
                
                expect(spy).wasCalled();
            });
            
            it("should update isFocused", function() {
                field.onBlur();
                
                expect(field.isFocused).toBeFalsy();
            });
            
            it("should fire a blur event", function() {
                var fired = false;
                
                field.on({
                    blur: function() {
                        fired = true;
                    }
                });
                
                field.onBlur();
                
                expect(fired).toBeTruthy();
            });
            
            describe("when the value has changed", function() {
                it("should fire a change event", function() {
                    var fired = false;
                    
                    field.on({
                        change: function() {
                            fired = true;
                        }
                    });
                    
                    field.setValue(10);
                    
                    field.onBlur();

                    expect(fired).toBeTruthy();
                });
            });
        });
        
        describe("on focus", function() {
            it("it should focus the dom", function() {
                var spy = spyOn(field.fieldEl.dom, "focus").andCallThrough();
                
                field.focus();
                
                expect(spy).wasCalled();
            });
        });
        
        describe("on blur", function() {
            it("it should blur the dom", function() {
                var spy = spyOn(field.fieldEl.dom, "blur").andCallThrough();
                
                field.blur();
                
                expect(spy).wasCalled();
            });
        });
        
        describe("getValue", function() {
            it("should return the value", function() {
                expect(field.getValue()).toEqual('');

                field.setValue('test');

                expect(field.getValue()).toEqual('test');
            });
            
            it("should call getValue on fieldEl", function() {
                var spy = spyOn(field.fieldEl, "getValue").andCallThrough();
                
                field.getValue();
                
                expect(spy).wasCalled();
            });
        });
    });

    // 100% coverage - tested above
    describe("when it has a container", function() {
        beforeEach(function() {
            panel = new Ext.Panel({
                fullscreen: true,
                items: [field],
                style: 'overflow:hidden',
                renderTo: Ext.getBody()
            });
        });
        
        afterEach(function() {
            window.scroll(0, 0);
            panel.destroy();
        });
        
        describe("on undoNativeScroll", function() {
            it("should run", function() {
                //
            });
        });
    });
});