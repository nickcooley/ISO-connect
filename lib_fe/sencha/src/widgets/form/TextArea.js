/**
 * @class Ext.form.TextArea
 * @extends Ext.form.Field
 * <p>Wraps a textarea. See {@link Ext.form.FormPanel FormPanel} for example usage.</p>
 * @xtype textarea
 */
Ext.form.TextArea = Ext.extend(Ext.form.TextField, {
    maskField: Ext.is.iOS,
    
    /**
     * @cfg {Integer} maxRows The maximum number of lines made visible by the input. 
     */
    maxRows  : undefined,
    
    autoCapitalize : false,
    
    renderTpl: [
        '<tpl if="label"><label <tpl if="fieldEl">for="{inputId}"</tpl> class="x-form-label"><span>{label}</span></label></tpl>',
        '<tpl if="fieldEl"><textarea id="{inputId}" type="{type}" name="{name}" class="{fieldCls}"',
            '<tpl if="tabIndex">tabIndex="{tabIndex}" </tpl>',
            '<tpl if="placeHolder">placeholder="{placeHolder}" </tpl>',
            '<tpl if="style">style="{style}" </tpl>',
            '<tpl if="maxRows != undefined">rows="{maxRows}" </tpl>',
            '<tpl if="maxlength">maxlength="{maxlength}" </tpl>',
            '<tpl if="autoComplete">autocomplete="{autoComplete}" </tpl>',
            '<tpl if="autoCapitalize">autocapitalize="{autoCapitalize}" </tpl>',
            '<tpl if="autoFocus">autofocus="{autoFocus}" </tpl>',
        '></textarea></tpl>',
        '<tpl if="showClear"><div class="x-field-clear x-hidden-display"></div></tpl>',
        '<tpl if="maskField"><div class="x-field-mask"></div></tpl>'
    ],
    
    ui: 'textarea',
    
    // @private
    onRender : function(ct, position) {
        this.renderData.maxRows = this.maxRows;
        Ext.form.TextArea.superclass.onRender.call(this, ct, position);
    }
});

Ext.reg('textarea', Ext.form.TextArea);
