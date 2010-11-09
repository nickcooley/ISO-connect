/**
 * @class Ext.List
 * @extends Ext.DataView
 * <p>A mechanism for displaying data using a list layout template. List uses an {@link Ext.XTemplate}
 * as its internal templating mechanism, and is bound to an {@link Ext.data.Store} so that as the data 
 * in the store changes the view is automatically updated to reflect the changes.</p>
 * <p>The view also provides built-in behavior for many common events that can occur for its contained items
 * including itemtap, containertap, etc. as well as a built-in selection model. <b>In order to use these
 * features, an {@link #itemSelector} config must be provided for the DataView to determine what nodes it
 * will be working with.</b></p>
 * <p>Here is a simple example of a {@link #grouped} {@link Ext.List}:</p>
 * 
 * <pre><code>
Ext.regModel('Contact', {
    fields: ['firstName', 'lastName']
});

var store = new Ext.data.JsonStore({
    model  : 'Contact',
    sorters: 'lastName',

    getGroupString : function(record) {
        return record.get('lastName')[0];
    },

    data: [
        {firstName: 'Tommy',   lastName: 'Maintz'},
        {firstName: 'Rob',     lastName: 'Dougan'},
        {firstName: 'Ed',      lastName: 'Spencer'},
        {firstName: 'Jamie',   lastName: 'Avins'},
        {firstName: 'Aaron',   lastName: 'Conran'},
        {firstName: 'Dave',    lastName: 'Kaneda'},
        {firstName: 'Michael', lastName: 'Mullany'},
        {firstName: 'Abraham', lastName: 'Elias'},
        {firstName: 'Jay',     lastName: 'Robinson'},
        {firstName: 'Tommy',   lastName: 'Maintz'},
        {firstName: 'Rob',     lastName: 'Dougan'},
        {firstName: 'Ed',      lastName: 'Spencer'},
        {firstName: 'Jamie',   lastName: 'Avins'},
        {firstName: 'Aaron',   lastName: 'Conran'},
        {firstName: 'Dave',    lastName: 'Kaneda'},
        {firstName: 'Michael', lastName: 'Mullany'},
        {firstName: 'Abraham', lastName: 'Elias'},
        {firstName: 'Jay',     lastName: 'Robinson'}
    ]
});

var list = new Ext.List({
    tpl: '&lt;tpl for="."&gt;&lt;div class="contact"&gt;{firstName} &lt;strong&gt;{lastName}&lt;/strong&gt;&lt;/div&gt;&lt;/tpl&gt;',

    itemSelector: 'div.contact',
    singleSelect: true,
    grouped     : true,
    indexBar    : true,
    
    store: store,
    
    floating     : true,
    width        : 350,
    height       : 370,
    centered     : true,
    modal        : true,
    hideOnMaskTap: false
});
list.show();
   </code></pre>
 * @constructor
 * Create a new List
 * @param {Object} config The config object
 * @xtype list
 */
Ext.List = Ext.extend(Ext.DataView, {
    cmpCls: 'x-list',

    /**
     * @cfg {Boolean} pinHeaders
     * Whether or not to pin headers on top of item groups while scrolling for an iPhone native list experience
     * Defaults to <tt>true</tt>
     */
    pinHeaders: (Ext.is.Android || Ext.is.Blackberry) ? false : true,

    /**
     * @cfg {Boolean/Object} indexBar
     * True to render an alphabet IndexBar docked on the right.
     * This can also be a config object that will be passed to {@link Ext.IndexBar}
     * (defaults to false)
     */
    indexBar: false,

    /**
     * @cfg {Boolean} grouped
     * True to group the list items together (defaults to false). When using grouping, you must specify a method getGroupString
     * on the store so that grouping can be maintained.
     * <pre><code>
Ext.regModel('Contact', {
    fields: ['firstName', 'lastName']
});

var store = new Ext.data.JsonStore({
    model  : 'Contact',
    sorters: 'lastName',

    getGroupString : function(record) {
        // Group by the last name
        return record.get('lastName')[0];
    },

    data: [
        {firstName: 'Tommy',   lastName: 'Maintz'},
        {firstName: 'Rob',     lastName: 'Dougan'},
        {firstName: 'Ed',      lastName: 'Spencer'},
        {firstName: 'Jamie',   lastName: 'Avins'},
        {firstName: 'Aaron',   lastName: 'Conran'},
        {firstName: 'Dave',    lastName: 'Kaneda'},
        {firstName: 'Michael', lastName: 'Mullany'},
        {firstName: 'Abraham', lastName: 'Elias'},
        {firstName: 'Jay',     lastName: 'Robinson'},
        {firstName: 'Tommy',   lastName: 'Maintz'},
        {firstName: 'Rob',     lastName: 'Dougan'},
        {firstName: 'Ed',      lastName: 'Spencer'},
        {firstName: 'Jamie',   lastName: 'Avins'},
        {firstName: 'Aaron',   lastName: 'Conran'},
        {firstName: 'Dave',    lastName: 'Kaneda'},
        {firstName: 'Michael', lastName: 'Mullany'},
        {firstName: 'Abraham', lastName: 'Elias'},
        {firstName: 'Jay',     lastName: 'Robinson'}
    ]
});
       </code></pre>
     */
    grouped: false,

    /**
     * @cfg {Boolean} clearSelectionOnDeactivate
     * True to clear any selections on the list when the list is deactivated (defaults to true).
     */
    clearSelectionOnDeactivate: true,


    renderTpl: [
        '<div class="{baseCls}-body"<tpl if="bodyStyle"> style="{bodyStyle}"</tpl>>',
            '<tpl if="grouped"><h3 class="x-list-header x-list-header-swap x-hidden-display"></h3></tpl>',
        '</div>'
    ],

    groupTpl : [
        '<tpl for=".">',
            '<div class="x-list-group x-group-{id}">',
                '<h3 class="x-list-header">{group}</h3>',
                '<div class="x-list-group-items">',
                    '{items}',
                '</div>',
            '</div>',
        '</tpl>'
    ],

    /**
     * @cfg {Boolean/Function/Object} disclosure
     * True to display a disclosure icon on each list item.
     * This won't bind a listener to the tap event. The list
     * will still fire the disclose event though.
     * By setting this config to a function, it will automatically
     * add a tap event listeners to the disclosure buttons which
     * will fire your function.
     * Finally you can specify an object with a 'scope' and 'handler'
     * property defined. This will also be bound to the tap event listener
     * and is useful when you want to change the scope of the handler.
     */
    disclosure : false,

    // @private
    initComponent : function() {
        if (this.scroll !== false) {
            this.scroll = {
                direction: 'vertical',
                scrollbars: false
            };
        }

        if (this.grouped) {
            this.itemTpl = this.tpl;
            if (Ext.isString(this.itemTpl) || Ext.isArray(this.itemTpl)) {
                this.itemTpl = new Ext.XTemplate(this.itemTpl);
            }
            if (Ext.isString(this.groupTpl) || Ext.isArray(this.groupTpl)) {
                this.tpl = new Ext.XTemplate(this.groupTpl);
            }
        }
        else {
            this.indexBar = false;
        }

        if (this.indexBar) {
            var indexBarConfig = Ext.apply({}, Ext.isObject(this.indexBar) ? this.indexBar : {}, {
                xtype: 'indexbar',
                dock: 'right',
                overlay: true,
                stretch: true,
                alphabet: true
            });
            this.indexBar = new Ext.IndexBar(indexBarConfig);
            this.dockedItems = this.dockedItems || [];
            this.dockedItems.push(this.indexBar);
            this.cls = this.cls || '';
            this.cls += ' x-list-indexed';
        } else if (this.scroll) {
            this.scroll.scrollbars = true;
        }

        Ext.List.superclass.initComponent.call(this);

        if (this.disclosure) {
            // disclosure can be a function that will be called when
            // you tap the disclosure button
            if (Ext.isFunction(this.disclosure)) {
                this.disclosure = {
                    scope: this,
                    handler: this.disclosure
                };
            }
            this.components = this.components || [];
            // We add the disclosure button the the list of components
            // to be rendered to each list item
            this.components.push({
                config: Ext.apply({}, this.disclosure.config || {}, {
                    xtype: 'button',
                    baseCls: 'x-disclosure'
                }),
                listeners: {
                    tap: this.onDisclosureTap,
                    scope: this
                }
            });
        }

        this.on('deactivate', this.onDeactivate, this);

        this.addEvents(
            // /**
            //  * @event itemswipe
            //  * Fires when the user swipes an item
            //  * @param {Ext.data.Record} record The record associated with the item
            //  * @param {Ext.Element} node The wrapping element of this node
            //  * @param {Number} index The index of this list item
            //  * @param {Ext.Event} event The swipe event. You can get the 'direction' from this object
            //  */
            // 'itemswipe',

            /**
             * @event disclose
             * Fires when the user taps the disclosure icon on an item
             * @param {Ext.data.Record} record The record associated with the item
             * @param {Ext.Element} node The wrapping element of this node
             * @param {Number} index The index of this list item
             */
            'disclose'
        );
    },

    // @private
    onRender : function() {
        if (this.grouped) {
            Ext.applyIf(this.renderData, {
                grouped: true
            });

            Ext.applyIf(this.renderSelectors, {
                header: '.x-list-header-swap'
            });
        }

        Ext.List.superclass.onRender.apply(this, arguments);
    },

    // @private
    onDeactivate : function() {
        if (this.clearSelectionOnDeactivate) {
            this.clearSelections();
        }
    },

    // @private
    afterRender : function() {
        if (!this.grouped) {
            this.el.addClass('x-list-flat');
        }
        this.getTemplateTarget().addClass('x-list-parent');

        Ext.List.superclass.afterRender.call(this);
    },

    // @private
    initEvents : function() {
        Ext.List.superclass.initEvents.call(this);

        if (this.grouped) {
            if (this.pinHeaders && this.scroll) {
                this.mon(this.scroller, {
                    scrollstart: this.onScrollStart,
                    scroll: this.onScroll,
                    scope: this
                });
            }

            if (this.indexBar) {
                this.mon(this.indexBar, {
                    index: this.onIndex,
                    scope: this
                });
            }
        }
    },

    // @private
    onDisclosureTap : function(e, t) {
        var node = this.findItemFromChild(t);
        if (node) {
            var record = this.getRecord(node),
                index = this.indexOf(node);

            this.fireEvent('disclose', record, node, index);

            if (Ext.isObject(this.disclosure) && this.disclosure.handler) {
                this.disclosure.handler.call(this, record, node, index);
            }
        }
    },

    /**
     * Set the current active group
     * @param {Object} group The group to set active
     */
    setActiveGroup : function(group) {
        var me = this;
        if (group) {
            if (!me.activeGroup || me.activeGroup.header != group.header) {
                me.header.setHTML(group.header.getHTML());
                me.header.show();
            }            
        }
        else {
            me.header.hide();
        }

        this.activeGroup = group;
    },

    // @private
    getClosestGroups : function(pos) {
        var groups = this.groupOffsets,
            ln = groups.length,
            group, i,
            current, next;

        for (i = 0; i < ln; i++) {
            group = groups[i];
            if (group.offset > pos.y) {
                next = group;
                break;
            }
            current = group;
        }

        return {
            current: current,
            next: next
        };
    },

    updateItems : function() {
        Ext.List.superclass.updateItems.apply(this, arguments);
        this.updateOffsets();
    },

    afterLayout : function() {
        Ext.List.superclass.afterLayout.apply(this, arguments);
        this.updateOffsets();
    },

    updateOffsets : function() {
        if (this.grouped) {
            this.groupOffsets = [];

            var headers = this.body.query('h3.x-list-header'),
                ln = headers.length,
                header, i;

            for (i = 0; i < ln; i++) {
                header = Ext.get(headers[i]);
                header.setDisplayMode(Ext.Element.VISIBILITY);
                this.groupOffsets.push({
                    header: header,
                    offset: header.dom.offsetTop
                });
            }
        }
    },

    // @private
    onScrollStart : function() {
        var offset = this.scroller.getOffset();
        this.closest = this.getClosestGroups(offset);
        this.setActiveGroup(this.closest.current);
    },

    // @private
    onScroll : function(scroller, pos, options) {
        if (!this.closest) {
            this.closest = this.getClosestGroups(pos);
        }

        if (!this.headerHeight) {
            this.headerHeight = this.header.getHeight();
        }

        if (pos.y <= 0) {
            if (this.activeGroup) {
                this.setActiveGroup(false);
                this.closest.next = this.closest.current;
            }
            return;
        }
        else if (
            (this.closest.next && pos.y > this.closest.next.offset) ||
            (pos.y < this.closest.current.offset)
        ) {
            this.closest = this.getClosestGroups(pos);
            this.setActiveGroup(this.closest.current);
        }
        if (this.closest.next && pos.y > 0 && this.closest.next.offset - pos.y <= this.headerHeight) {
            var transform = this.headerHeight - (this.closest.next.offset - pos.y);
            this.header.setStyle('-webkit-transform', 'translate3d(0, -' + transform + 'px, 0)');
            this.transformed = true;
        }
        else if (this.transformed) {
            this.header.setStyle('-webkit-transform', null);
            this.transformed = false;
        }
    },

    // @private
    onIndex : function(record, target, index) {
        var key = record.get('key').toLowerCase(),
            groups = this.store.getGroups(),
            ln = groups.length,
            group, i, closest, id;

        for (i = 0; i < ln; i++) {
            group = groups[i];
            id = this.getGroupId(group);

            if (id == key || id > key) {
                closest = id;
                break;
            }
            else {
                closest = id;
            }
        }

        closest = this.body.down('.x-group-' + id);
        if (closest) {
            this.scroller.scrollTo({x: 0, y: closest.getOffsetsTo(this.scrollEl)[1]}, false, null, true);
        }
    },

    getGroupId : function(group) {
        return group.name.toLowerCase();
    },

    // @private
    collectData : function(records, startIndex) {
        if (!this.grouped) {
            return Ext.List.superclass.collectData.call(this, records, startIndex);
        }

        var results = [],
            groups = this.store.getGroups(),
            ln = groups.length,
            children, cln, c,
            group, i;

        for (i = 0, ln = groups.length; i < ln; i++) {
            group = groups[i];
            children = group.children;
            for (c = 0, cln = children.length; c < cln; c++) {
                children[c] = children[c].data;
            }
            results.push({
                group: group.name,
                id: this.getGroupId(group),
                items: this.itemTpl.apply(children)
            });
        }

        return results;
    },

    // Because the groups might change by an update/add/remove we refresh the whole dataview
    // in each one of them
    // @private
    onUpdate : function(ds, record) {
        if (this.grouped) {
            this.refresh();
        }
        else {
            Ext.List.superclass.onUpdate.apply(this, arguments);
        }
    },

    // @private
    onAdd : function(ds, records, index) {
        if (this.grouped) {
            this.refresh();
        }
        else {
            Ext.List.superclass.onAdd.apply(this, arguments);
        }
    },

    // @private
    onRemove : function(ds, record, index) {
        if (this.grouped) {
            this.refresh();
        }
        else {
            Ext.List.superclass.onRemove.apply(this, arguments);
        }
    }
});

Ext.reg('list', Ext.List);
