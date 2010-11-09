/**
 * @class Ext.Picker
 * @extends Ext.Sheet
 *
 * <p>A general picker class.  Slots are used to organize multiple scrollable slots into a single picker. {@link #slots} is 
 * the only necessary property</p>
 * 
 * <p>Example usage:</p>
 * <pre><code>
var picker = new Ext.Picker({
    slots: [
        {
            name : 'limit_speed',
            title: 'Speed',
            data : [
                {text: '50 KB/s', value: 50},
                {text: '100 KB/s', value: 100},
                {text: '200 KB/s', value: 200},
                {text: '300 KB/s', value: 300}
            ]
        }
    ]
});
picker.show();
 * </code></pre>
 * 
 * <p>See also: {@link Ext.DatePicker}</p>
 * 
 * @constructor
 * Create a new List
 * @param {Object} config The config object
 * @xtype picker
 */
Ext.Picker = Ext.extend(Ext.Sheet, {
    /**
     * @cfg {String} cmpCls
     * The main component class
     */
    cmpCls: 'x-picker',
    
    stretchX: true,
    stretchY: true,
    hideOnMaskTap: false,
    
    /**
     * @cfg {String} doneText
     * The text to be used on the done button if {@link #showDoneButton} is true.
     * Defaults to 'Done'.
     */
    doneText: 'Done',
    
    /**
     * @cfg {Boolean} showDoneButton
     * True to show the done button.
     * Defaults to true.
     */
    showDoneButton : true,
    
    /**
     * @cfg {Number} height
     * The height of the picker.
     * Defaults to 220
     */
    height: 220,
    
    /**
     * @cfg {Boolean} useTitles
     * Generate a title header for each individual slot and use
     * the title configuration of the slot.
     * Defaults to false.
     */
    useTitles: false,

    /**
     * @cfg {String} activeCls
     * CSS class to be applied to individual list items when they have
     * been chosen.
     */
    // activeCls: 'x-picker-active-item',

    /**
     * @cfg {Array} slots
     * An array of slot configurations.
     * <ul>
     *  <li>name - {String} - Name of the slot</li>
     *  <li>align - {String} - Alignment of the slot. left, right, or center</li>
     *  <li>items - {Array} - An array of text/value pairs in the format {text: 'myKey', value: 'myValue'}</li>
     *  <li>title - {String} - Title of the slot. This is used in conjunction with useTitles: true.</li>
     * </ul>
     */
    //
    // chosenCls: 'x-picker-chosen-item',
    
    // private
    defaultType: 'pickerslot',
    
    // private
    initComponent : function() {
        this.layout = {
            type: 'hbox',
            align: 'stretch'
        };

        if (this.slots) {
            this.items = this.items ? (Ext.isArray(this.items) ? this.items : [this.items]) : [];
            this.items = this.items.concat(this.slots);
        }
        
        if (this.useTitles) {
            this.defaults = Ext.applyIf(this.defaults || {}, {
                title: ''
            });            
        }

        this.on('slotpick', this.onSlotPick, this);
        this.addEvents('pick', 'change');

        if (this.showDoneButton) {
            this.toolbar = new Ext.Toolbar(Ext.applyIf(this.buttonBar || {
                dock: 'top'
            }));

            this.toolbar.add([
                {xtype: 'spacer'},
                {
                    xtype: 'button',
                    ui: 'action',
                    text: this.doneText,
                    handler: this.onDoneTap,
                    scope: this
                }
            ]);

            this.dockedItems = this.dockedItems ? (Ext.isArray(this.dockedItems) ? this.dockedItems : [this.dockedItems]) : [];
            this.dockedItems.push(this.toolbar);
        }

        Ext.Picker.superclass.initComponent.call(this);

        if (this.value) {
            this.setValue(this.value, false);
        }
    },
    
    /**
     * @private
     * Called when the done button has been tapped.
     */
    onDoneTap : function() {
        var anim = this.animSheet('depart');
        Ext.apply(anim, {
            after: function() {
                this.fireEvent('change', this, this.getValue());
            },
            scope: this
        });
        this.hide(anim);
    },
    
    /**
     * @private
     * Called when a slot has been picked.
     */
    onSlotPick : function(slot, value, node) {
        this.fireEvent('pick', this, this.getValue(), slot);
        return false;
    },
    
    /**
     * Sets the values of the pickers slots
     * @param {Object} values The values in a {name:'value'} format
     * @animated {Boolean} animated True to animate setting the values
     */
    setValue : function(values, animated) {
        var key, slot,
            items = this.items.items,
            ln = items.length;

        // Value is an object with keys mapping to slot names
        if (!values) {
            for (i = 0; i < ln; i++) {
                items[i].setValue(0);
            }
            return this;
        }

        for (key in values) {
            slot = this.child('[name=' + key + ']');
            if (slot) {
                slot.setValue(values[key], animated);
            }
        }

        return this;
    },
    
    /**
     * Returns the values of each of the pickers slots
     * @return {Object} The value of the pickers slots
     */
    getValue : function() {
        var value = {},
            items = this.items.items,
            ln = items.length, item, i;

        for (i = 0; i < ln; i++) {
            item = items[i];
            value[item.name] = item.getValue();
        }

        return value;
    }
});

Ext.regModel('x-textvalue', {
    fields: ['text', 'value']
});

/**
 * @private
 * @class Ext.Picker.Slot
 * @extends Ext.DataView
 *
 * <p>A general picker slot class.  Slots are used to organize multiple scrollable slots into a single picker
 * See also: {@link Ext.Picker}</p>
 * 
 * @constructor
 * Create a new Picker Slot
 * @param {Object} config The config object
 * @xtype pickerslot
 */
Ext.Picker.Slot = Ext.extend(Ext.DataView, {
    isSlot: true,
    flex: 1,

    /**
     * @cfg {String} name
     * The name of this slot. This config option is required.
     */
    name: null,

    /**
     * @cfg {String} displayField
     * The display field in the store.
     * Defaults to 'text'.
     */
    displayField: 'text',

    /**
     * @cfg {String} valueField
     * The value field in the store.
     * Defaults to 'value'.
     */
    valueField: 'value',

    /**
     * @cfg {String} align
     * The alignment of this slot.
     * Defaults to 'center'
     */
    align: 'center',
    
    /**
     * @hide
     * @cfg {String} itemSelector
     */
    itemSelector: 'li.x-picker-item',
    
    /**
     * @private
     * @cfg {String} cmpCls
     * The main component class
     */
    cmpCls: 'x-picker-slot',
    
    /**
     * @private
     * @cfg {Ext.Template/Ext.XTemplate/Array} renderTpl
     * The renderTpl of the slot.
     */
    renderTpl : [
        '<div class="{baseCls}-body"<tpl if="bodyStyle"> style="{bodyStyle}"</tpl>>',
            '<div class="x-picker-mask">',
                '<div class="x-picker-bar"></div>',
            '</div>',
        '</div>'
    ],
    
    /**
     * @private
     * The current selectedIndex of the picker slot
     */
    selectedIndex: 0,
    
    /**
     * @private
     */
    getElConfig : function() {
        return {
            tag: 'div',
            id: this.id,
            cls: 'x-picker-' + this.align
        };
    },
    
    /**
     * @private
     */
    initComponent : function() {
        // <debug>
        if (!this.name) {
            throw 'Each picker slot is required to have a name.';
        }
        // </debug>

        Ext.apply(this.renderSelectors, {
            mask: '.x-picker-mask',
            bar: '.x-picker-bar'
        });

        this.scroll = {
            direction: 'vertical',
            scrollbars: false,
            snapDuration: 200,
            friction: 0.9,
            acceleration: 20,
            scrollToDuration: 150,
            scrollToEasing: 'ease-in'
        };

        this.tpl = new Ext.XTemplate([
            '<tpl for=".">',
                '<li class="x-picker-item {cls} <tpl if="extra">x-picker-invalid</tpl>">{' + this.displayField + '}</li>',
            '</tpl>'
        ]);

        var data = this.data,
            parsedData = [],
            ln = data && data.length,
            i, item, obj;

        if (data && Ext.isArray(data) && ln) {
            for (i = 0; i < ln; i++) {
                item = data[i];
                obj = {};
                if (Ext.isArray(item)) {
                    obj[this.valueField] = item[0];
                    obj[this.displayField] = item[1];
                }
                else if (Ext.isString(item)) {
                    obj[this.valueField] = item;
                    obj[this.displayField] = item;
                }
                else if (Ext.isObject(item)) {
                    obj = item;
                }
                parsedData.push(obj);
            }

            this.store = new Ext.data.Store({
                model: 'x-textvalue',
                data: parsedData
            });
            this.tempStore = true;
        }
        else if (this.store) {
            this.store = Ext.StoreMgr.lookup(this.store);
        }

        this.enableBubble('slotpick');

        if (this.title) {
            this.title = new Ext.Component({
                dock: 'top',
                cmpCls: 'x-picker-slot-title',
                html: this.title
            });
            this.dockedItems = this.title;
        }

        Ext.Picker.Slot.superclass.initComponent.call(this);

        if (this.value !== undefined) {
            this.setValue(this.value, false);
        }
    },
    
    /**
     * @private
     */
    setupBar: function() {
        this.body.setStyle({padding: ''});

        var padding = this.bar.getY() - this.body.getY();
        this.barHeight = this.bar.getHeight();

        this.body.setStyle({
            padding: padding + 'px 0'
        });
        this.slotPadding = padding;
        this.scroller.updateBounds();
        this.scroller.setSnap(this.barHeight);
        this.setSelectedNode(this.selectedIndex, false);
    },
    
    /**
     * @private
     */
    afterComponentLayout : function() {
        // Dont call superclass afterComponentLayout since we dont want
        // the scrollel to get a min-height
        Ext.defer(this.setupBar, 200, this);
    },
    
    /**
     * @private
     */
    initEvents : function() {
        this.mon(this.scroller, {
            scrollend: this.onScrollEnd,
            scope: this
        });
    },
    
    /**
     * @private
     */
    onScrollEnd : function(scroller, offset) {
        this.selectedNode = this.getNode(Math.round(offset.y / this.barHeight));
        this.selectedIndex = this.indexOf(this.selectedNode);
        this.fireEvent('slotpick', this, this.getValue(), this.selectedNode);
    },
    
    /**
     * @private
     */
    scrollToNode: function(node, animate) {
        var offsetsToBody = Ext.fly(node).getOffsetsTo(this.scrollEl)[1];
        this.scroller.scrollTo({
            y: offsetsToBody
        }, animate !== false ? true : false);
    },
    
    /**
     * @private
     * Called when an item has been tapped
     */
    onItemTap : function(node) {
        Ext.Picker.Slot.superclass.onItemTap.apply(this, arguments);
        this.setSelectedNode(node);
    },
    
    /**
     * 
     */
    getSelectedNode : function() {
        return this.selectedNode;
    },
    
    /**
     * 
     */
    setSelectedNode : function(selected, animate) {
        // If it is a number, we assume we are dealing with an index
        if (Ext.isNumber(selected)) {
            selected = this.getNode(selected);
        }
        else if (selected.isModel) {
            selected = this.getNode(this.store.indexOf(selected));
        }

        // If its not a model or a number, we assume its a node
        if (selected) {
            this.selectedNode = selected;
            this.selectedIndex = this.indexOf(selected);
            this.scrollToNode(selected, animate);
        }
    },
    
    /**
     * 
     */
    getValue : function() {
        var record = this.store.getAt(this.selectedIndex);
        return record ? record.get(this.valueField) : null;
    },

    /**
     * 
     */
    setValue : function(value, animate) {
        var index = this.store.find(this.valueField, value);
        if (index != -1) {
            if (!this.rendered) {
                this.selectedIndex = index;
                return;
            }
            this.setSelectedNode(index, animate);
        }
    },

    onDestroy : function() {
        if (this.tempStore) {
            this.store.destroyStore();
            this.store = null;
        }
        Ext.Picker.Slot.superclass.onDestroy.call(this);
    }
});

Ext.reg('pickerslot', Ext.Picker.Slot);
