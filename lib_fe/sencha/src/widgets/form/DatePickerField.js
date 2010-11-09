/**
 * @class Ext.form.DatePickerField
 * @extends Ext.form.Field
 * <p>Specialized field which has a button which when pressed, shows a {@link Ext.DatePicker}.</p>
 * @xtype datepickerfield
 */
Ext.form.DatePickerField = Ext.extend(Ext.form.Field, {
    ui: 'select',
    
    /**
     * @cfg {Object} datePickerConfig
     * An object that is used when creating the internal {@link Ext.DatePicker} component.
     * Defaults to null
     */
    datePickerConfig: null,
    
    // inherit docs
    maskField: true,
    
    /**
     * @cfg {Object/Date} value
     * Default value for the field and the internal {@link Ext.DatePicker} component. Accepts an object of 'year', 
     * 'month' and 'day' values, all of which should be numbers, or a {@link Date}.
     * 
     * Example: {year: 1989, day: 1, month: 5} = 1st May 1989 or new Date()
     */
    
    // @private
    initComponent: function() {
        this.tabIndex = -1;
        
        Ext.form.DatePickerField.superclass.initComponent.apply(this, arguments);
    },
    
    /**
     * @private
     * Listener to the tap event on the internal {@link #button}. Shows the internal {@link #datePicker} component when the button has been tapped.
     */
    onMaskTap: function() {
        var me     = this,
            config = Ext.apply(me.datePickerConfig || {}, {
            value: me.value || null,
            
            listeners: {
                scope : me,
                change: me.onPickerChange,
                hide  : me.onPickerHide
            }
        });
        
        me.datePicker = new Ext.DatePicker(config);
        me.datePicker.show();
    },
    
    /**
     * Called when the picker changes its value
     * @param {Ext.DatePicker} picker The date picker
     * @param {Object} value The new value from the date picker
     * @private
     */
    onPickerChange : function(picker, value) {
        var me = this;
        
        me.setValue(value);
        me.fireEvent('select', me, me.getValue());
    },
    
    /**
     * Destroys the picker when it is hidden
     * @private
     */
    onPickerHide : function() {
        this.datePicker.destroy();
    },

    // inherit docs
    setValue: function(value) {
        var me = this;
        
        if (Ext.isDate(value)) {
            me.value = value;
        } else if (Ext.isObject(value)) {
            me.value = new Date(value.year, value.month - 1, value.day);
        } else {
            me.value = null;
        }
        
        if (me.rendered) {
            me.fieldEl.dom.value = value ? me.getValue(true) : null;
        }
        
        return me;
    },
    
    /**
     * Returns the value of the field, which will be a {@link Date} unless the <tt>format</tt> paramater is true.
     * @param {Boolean} format True to format the value with <tt>Ext.util.Format.defaultDateFormat</tt>
     */
    getValue: function(format) {
        var value = this.value || null;
        return (format && Ext.isDate(value)) ? value.format(Ext.util.Format.defaultDateFormat) : value;
    },
    
    // @private
    onDestroy: function() {
        if (this.datePicker) this.datePicker.destroy();
        Ext.form.DatePickerField.superclass.onDestroy.call(this);
    }
});

Ext.reg('datepickerfield', Ext.form.DatePickerField);