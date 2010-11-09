/**
 * @class Ext.form.TextField
 * @extends Ext.form.Field
 * <p>Simple text input field. See {@link Ext.form.FormPanel FormPanel} for example usage.</p>
 * @xtype textfield
 */
Ext.form.TextField = Ext.extend(Ext.form.Field, {
    type: 'text',
    maskField: Ext.is.iOS
    
    /**
     * @cfg {Integer} maxLength Maximum number of character permit by the input. 
     */
});

Ext.reg('textfield', Ext.form.TextField);
