/**
 * @class Ext.form.Select
 * @extends Ext.form.Field
 * Simple Select field wrapper. Example usage:
<pre><code>
new Ext.form.Select({
    options: [
        {text: 'First Option',  value: 'first'},
        {text: 'Second Option', value: 'second'},
        {text: 'Third Option',  value: 'third'}
    ]
});
</code></pre>
 * @xtype select
 */
Ext.form.Select = Ext.extend(Ext.form.TextField, {

    ui: 'select',
    /**
     * @cfg {Boolean} showClear @hide
     */

    /**
     * @cfg {String/Integer} valueField The underlying {@link Ext.data.Field#name data value name} (or numeric Array index) to bind to this
     * Select control. (defaults to 'value')
     */
    valueField: 'value',

    /**
     * @cfg {String/Integer} displayField The underlying {@link Ext.data.Field#name data value name} (or numeric Array index) to bind to this
     * Select control. This resolved value is the visibly rendered value of the available selection options.
     * (defaults to 'text')
     */
    displayField: 'text',

    /**
     * @cfg {Ext.data.Store} store (Optional) store instance used to provide selection options data.
     */

    /**
     * @cfg {Array} options (Optional) An inline array of selection option objects containing corresponding
     * {@link #valueField valueField} and {@link #displayField displayField} suitable for rendering the options list.
     */
    
    maskField: true,

    /**
     * @cfg {String} prependText A static string to prepend before the active item's text when displayed as the
     * select's text. Defaults to ''.
     */
    prependText: '',
    
    /**
     * @cfg {String} hiddenName Specify a hiddenName if you're using the {@link Ext.form.FormPanel#standardSubmit standardSubmit} option.
     * This name will be used to post the underlying value of the select to the server.
     */
    hiddenName: '',

    // @private
    tabIndex: -1,

    // @private
    initComponent: function() {
        // backwards compatibility - deprecate in next major release
        this.label = this.label || this.fieldLabel;

        var options    = this.options,
            ln         = options && options.length;

        if (options && Ext.isArray(options) && ln) {
            this.store = new Ext.data.Store({
                model: 'x-textvalue',
                data: options
            });
        }
        else if (this.store) {
            this.store = Ext.StoreMgr.lookup(this.store);
        }

        Ext.form.Select.superclass.initComponent.call(this);

        this.addEvents(
            /**
             * @event change
             * Fires when an option selection has changed
             * @param {Ext.form.Select} this
             * @param {Mixed} value
             */
            'change'
        );
    },
    
    onRender: function() {
        var name = this.hiddenName;
            
        Ext.form.Select.superclass.onRender.apply(this, arguments);
        
        if (name) {
            this.hiddenField = this.el.insertSibling({
                name: name,
                tag: 'input',
                type: 'hidden'
            }, 'after', true);
        }
    },

    getPicker: function() {
        if (!this.picker) {
            this.picker = new Ext.Picker({
                slots: [{
                    align       : 'center',
                    name        : this.name,
                    valueField  : this.valueField,
                    displayField: this.displayField,
                    value       : this.getValue(),
                    store       : this.store
                }],
                listeners: {
                    change: this.onPickerChange,
                    scope: this
                }
            });
        }

        return this.picker;
    },

    getListPanel: function() {
        if (!this.listPanel) {
            this.listPanel = new Ext.Panel({
                floating         : true,
                stopMaskTapEvent : true,
                hideOnMaskTap    : true,
                cls              : 'x-select-overlay',
                items: {
                    xtype: 'list',
                    store: this.store,
                    itemId: 'list',
                    itemTpl : [
                        '<span class="x-list-label">{' + this.displayField + '}</span>',
                        '<span class="x-list-selected"></span>'
                    ],
                    listeners: {
                        select : this.onListSelect,
                        scope  : this
                    }                    
                }
            });
        }

        return this.listPanel;
    },

    onMaskTap: function() {
        if (this.disabled) {
            return;
        }
        
        this.showComponent();
    },

    showComponent: function() {
        if (Ext.is.Phone) {
            this.getPicker().show();
        }
        else {
            var listPanel = this.getListPanel(),
                index = this.store.find(this.valueField, this.value);

            listPanel.showBy(this.el, 'fade', false);
            listPanel.down('#list').getSelectionModel().select(index != -1 ? index: 0, false, true);
        }
    },

    onListSelect: function(selModel, selected) {
        if (selected) {
            this.setValue(selected.get(this.valueField));
            this.fireEvent('change', this, this.getValue());
        }
        
        this.listPanel.hide({
            type: 'fade',
            out: true,
            scope: this
        });
    },

    onPickerChange: function(picker, value) {
        var currentValue = this.getValue(),
            newValue = value[this.name];

        if (newValue != currentValue) {
            this.setValue(newValue);
            this.fireEvent('change', this, newValue);
        }
    },
    
    getValue: function() {
        return this.value;
    },

    initValue: function() {
        this.setValue(this.value);
        this.originalValue = this.getValue();
    },

    setValue: function(v) {
        var record = v ? this.store.findRecord(this.valueField, v): this.store.getAt(0),
            hidden = this.hiddenField;

        if (record && this.rendered) {
            this.fieldEl.dom.value = this.prependText + ' ' + record.get(this.displayField);
            this.value = record.get(this.valueField);
        } else {
            this.value = v;
        }
        
        if (hidden) {
            hidden.value = this.value;
        }
        return this;
    },

    /**
     * Updates the underlying &lt;options&gt; list with new values.
     * @param {Array} options An array of options configurations to insert or append.
     * @param {Boolean} append <tt>true</tt> to append the new options existing values.
<pre><code>
selectBox.setOptions(
    [   {text: 'First Option',  value: 'first'},
        {text: 'Second Option', value: 'second'},
        {text: 'Third Option',  value: 'third'}
    ]).setValue('third');
</code></pre>
     * Note: option object member names should correspond with defined {@link #valueField valueField} and
     * {@link #displayField displayField} values.
     * @return {Ext.form.Select} this
     */
    setOptions: function(options, append) {
        if (!options) {
            this.store.clearData();
            this.setValue(null);
        }
        else {
            this.store.loadData(options, append);
        }
    },

    destroy: function() {
        Ext.form.Select.superclass.destroy.apply(this, arguments);

        if (this.listPanel) {
            this.listPanel.destroy();
        }

        if (this.picker) {
            this.picker.destroy();
        }
    }
});

Ext.reg('select', Ext.form.Select);