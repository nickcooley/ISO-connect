/**
 * @class Ext.form.Checkbox
 * @extends Ext.form.Field
 * Simple Checkbox class. Can be used as a direct replacement for traditional checkbox fields.
 * @constructor
 * @param {Object} config Optional config object
 * @xtype checkbox
 */
Ext.form.Checkbox = Ext.extend(Ext.form.Field, {
    inputType: 'checkbox',
    ui: 'checkbox',
    
    /**
     * @cfg {Boolean} showClear @hide
     */

    /**
     * @cfg {Boolean} checked <tt>true</tt> if the checkbox should render initially checked (defaults to <tt>false</tt>)
     */
    checked : false,
    
    /**
     * @cfg {String} inputValue The string value to submit if the item is in a checked state.
     */
    inputValue : undefined,

    // @private
    constructor: function(config) {
        this.addEvents(
            /**
             * @event check
             * Fires when the checkbox is checked or unchecked.
             * @param {Ext.form.Checkbox} this This checkbox
             * @param {Boolean} checked The new checked value
             */
            'check'
        );

        Ext.form.Checkbox.superclass.constructor.call(this, config);
    },
    
    renderTpl: [
        '<tpl if="label"><label <tpl if="fieldEl">for="{inputId}"</tpl> class="x-form-label"><span>{label}</span></label></tpl>',
        '<tpl if="fieldEl"><input id="{inputId}" type="{type}" name="{name}" class="{fieldCls}" ',
            '<tpl if="tabIndex">tabIndex="{tabIndex}" </tpl>',
            '<tpl if="checked"> checked </tpl>',
            '<tpl if="style">style="{style}" </tpl> value="{inputValue}" />',
        '</tpl>'
    ],

    // @private
    onRender : function(ct, position) {
        var me = this;
        
        Ext.apply(me.renderData, {
            inputValue : me.inputValue || me.value || '',
            checked    : me.checked = /^(true|1|on)/i.test(String(me.checked))
        });
        
        Ext.form.Checkbox.superclass.onRender.call(me, ct, position);

        if (me.fieldEl) {
            me.mon(me.fieldEl, {
                change: me.onChange,
                scope: me
            });
            
	        me.setValue(me.checked);
        }
        
    },
    
    // @private
    onChange : function() {
        this.fireEvent('check', this, this.getValue());
    },

    /**
     * Returns the checked state of the checkbox.
     * @return {Boolean} True if checked, else false
     */
    getValue : function(){
        if (this.rendered) {
            return this.fieldEl.dom.checked || false;
        }
        return this.checked || false;
    },

    /**
     * Sets the checked state of the checkbox and fires the 'check' event.
     * @param {Boolean/String} checked The following values will check the checkbox:
     * <code>true, 'true', '1', or 'on'</code>. Any other value will uncheck the checkbox.
     */
    setValue : function(v) {

        var checked = this.getValue();
        this.checked = /^(true|1|on)/i.test(String(v));
        
        if (this.rendered) {
            this.fieldEl.dom.checked = this.fieldEl.dom.defaultChecked = this.checked;
        }
        
        if (checked != this.checked) {
            this.onChange();
        }
    }
});

Ext.reg('checkbox', Ext.form.Checkbox);
