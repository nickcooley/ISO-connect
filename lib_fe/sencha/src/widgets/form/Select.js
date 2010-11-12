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

     // @private
    initComponent : function() {
        var me = this;
        
        //backwards compatibility - deprecate in next major release
        me.label = me.label || me.fieldLabel;

        var options    = me.options,
            parsedData = [],
            ln         = options && options.length,
            i, item, obj;

        if (options && Ext.isArray(options) && ln) {
            me.store = new Ext.data.Store({
                model: 'x-textvalue',
                data: options
            });
        }
        else if (me.store) {
            me.store = Ext.StoreMgr.lookup(me.store);
        }

        me.tabIndex = -1;

        Ext.form.Select.superclass.initComponent.call(me);

        me.addEvents(
            /**
             * @event select
             * Fires when an option selection has changed
             * @param {Ext.form.Select} this
             * @param {Mixed} value
             */
            'select'
        );
    },

    onMaskTap: function() {
        if (this.disabled) {
            return;
        }
        
        var me = this;
        
        if (Ext.is.Phone) {
            me.picker = new Ext.Picker({
                slots: [{
                    align       : 'center',
                    name        : me.name,
                    valueField  : me.valueField,
                    displayField: me.displayField,
                    value       : me.getValue(),
                    store       : me.store
                }],
                listeners: {
                    change: me.onPickerChange,
                    hide  : me.onPickerHide,
                    scope : me
                }
            });

            me.picker.show();
        }
        else {
            me.list = new Ext.List({
                store: me.store,
                tpl  : [
                    '<tpl for=".">',
                        '<div class="x-list-item">',
                            '<span class="x-list-label">{' + me.displayField + '}</span>',
                            '<span class="x-list-selected"></span>',
                        '</div>',
                    '</tpl>'
                ],
                cls             : 'x-select-overlay',
                itemSelector    : '.x-list-item',
                floating        : true,
                stopMaskTapEvent: true,
                hideOnMaskTap   : true,
                singleSelect    : true,
                
                listeners: {
                    selectionchange: me.onListSelect,
                    scope          : me
                }
            });
            
            me.list.showBy(me.el, 'fade', false);
            var index = me.store.find(me.valueField, me.value);
            me.list.select(index != -1 ? index : 0, false, true);
        }
    },

    onListSelect : function(list, node, records) {
        var me       = this,
            selected = records[0];
        
        if (selected) {
            me.setValue(selected.get(me.valueField));
            me.fireEvent('select', me, me.getValue());
        }
        
        me.list.hide({
            type: 'fade',
            out: true,
            after: function() {
                me.list.destroy();
            },
            scope: me
        });
    },

    onPickerChange : function(picker, value) {
        var me = this;
        me.setValue(value[me.name]);
        me.fireEvent('select', me, me.getValue());
    },

    onPickerHide : function() {
        this.picker.destroy();
    },

    getValue : function() {
        return this.value;
    },

    initValue : function() {
        var me = this;
        me.setValue(me.value);
        me.originalValue = me.getValue();
    },

    setValue : function(v) {
        var me     = this,
            record = v ? me.store.findRecord(me.valueField, v) : me.store.getAt(0);

        if (record && me.rendered) {
            me.fieldEl.dom.value = me.prependText + ' ' + record.get(me.displayField);
            me.value = record.get(me.valueField);
        } else {
            me.value = v;
        }

        return me;
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
    setOptions : function(options, append) {
        var me = this;
        if (!options) {
            me.store.clearData();
            me.setValue(null);
        }
        else {
            me.store.loadData(options, append);
        }
    }
});

Ext.reg('select', Ext.form.Select);
