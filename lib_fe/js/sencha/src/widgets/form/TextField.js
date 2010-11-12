/**
 * @class Ext.form.TextField
 * @extends Ext.form.Field
 * <p>Simple text input field. See {@link Ext.form.FormPanel FormPanel} for example usage.</p>
 * @xtype textfield
 */
Ext.form.TextField = Ext.extend(Ext.form.Field, {
    maskField: Ext.is.iOS,

    onKeyUp: function(e) {
        Ext.form.TextField.superclass.onKeyUp.apply(this, arguments);
        
        if (e.browserEvent.keyCode === 13) {
            this.blur();
            Ext.Viewport.scrollToTop();
        }
    }

    /**
     * @cfg {Integer} maxLength Maximum number of character permit by the input. 
     */
});

Ext.reg('textfield', Ext.form.TextField);
