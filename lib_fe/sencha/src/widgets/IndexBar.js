/**
 * @class Ext.IndexBar
 * @extends Ext.DataPanel
 * <p>IndexBar is a component used to display a list of data (primarily an {@link #alphabet}) which can then be used to quickly 
 * navigate through a list (see {@link Ext.List}) of data. When a user taps on an item in the {@link Ext.IndexBar}, it will fire 
 * the <tt>{@link #index}</tt> event.</p>
 * 
 * <p>Here is an example of the usage in a {@link Ext.List}:</p>
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
 * 
 * <p>Alternatively you can initate the {@link Ext.IndexBar} component manually in a custom component by using something 
 * similar to the following example:<p>
 * 
 * <code><pre>
var indexBar = new Ext.IndexBar({
    dock    : 'right',
    overlay : true,
    alphabet: true
});
 * </code></pre>
 * @constructor
 * Create a new IndexBar
 * @param {Object} config The config object
 * @xtype indexbar
 */
Ext.IndexBar = Ext.extend(Ext.DataPanel, {
    /**
     * @cfg {String} cmpCls Base CSS class
     * Defaults to <tt>'x-indexbar'</tt>
     */
    cmpCls: 'x-indexbar',

    /**
     * @cfg {String} direction Layout direction, can be either 'vertical' or 'horizontal'
     * Defaults to <tt>'vertical'</tt>
     */
    direction: 'vertical',

    /**
     * @cfg {String} tpl Template for items
     */
    tpl: '<tpl for="."><span class="x-indexbar-item">{value}</span></tpl>',

    /**
     * @cfg {String} itemSelector <b>Required</b>. A simple CSS selector (e.g. <tt>span.x-indexbar-item</tt> for items
     */
    itemSelector: 'span.x-indexbar-item',
    
    /**
     * @cfg {Array} letters
     * The letters to show on the index bar. Defaults to the English alphabet, A-Z.
     */
    letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],

    /**
     * @cfg {String} listPrefix
     * The prefix string to be appended at the beginning of the list. E.g: useful to add a "#" prefix before numbers
     */
    listPrefix: '',
    
    /**
     * @cfg {Boolean} alphabet true to use the {@link #letters} property to show a list of the alphabet. Should <b>not</b> be used 
     * in conjunction with {@link #store}.
     */
    
    /**
     * @cfg {Ext.data.Store} store
     * The store to be used for displaying data on the index bar. The store model must have a <tt>value</tt> field when using the 
     * default {@link #tpl}. If no {@link #store} is defined, it will create a store using the <tt>IndexBarModel</tt> model.
     */

    // We dont want the body of this component to be sized by a DockLayout, thus we set the layout to be an autocomponent layout.
    componentLayout: 'autocomponent',
    
    // @private
    initComponent : function() {
        // No docking and no sizing of body!
        this.componentLayout = this.getComponentLayout();

        if (!this.store) {
            this.store = new Ext.data.Store({
                model: 'IndexBarModel'
            });
        }

        if (this.alphabet == true) {
            this.ui = this.ui || 'alphabet';
        }

        if (this.direction == 'horizontal') {
            this.horizontal = true;
        }
        else {
            this.vertical = true;
        }
        
        this.addEvents(
          /**
           * @event index
           * Fires when an item in the index bar display has been tapped
           * @param {Ext.data.Model} record The record tapped on the indexbar
           * @param {HTMLElement} target The node on the indexbar that has been tapped
           * @param {Number} index The index of the record tapped on the indexbar
           */
          'index'
        );

        Ext.IndexBar.superclass.initComponent.call(this);
    },

    // @private
    afterRender : function() {
        Ext.IndexBar.superclass.afterRender.call(this);

        if (this.alphabet === true) {
            this.loadAlphabet();
        }

        if (this.vertical) {
            this.el.addClass(this.cmpCls + '-vertical');
        }
        else if (this.horizontal) {
            this.el.addClass(this.cmpCls + '-horizontal');
        }
    },

    // @private
    loadAlphabet : function() {
        var letters = this.letters,
            len = letters.length,
            data = [],
            i, letter;

        for (i = 0; i < len; i++) {
            letter = letters[i];
            data.push({key: letter.toLowerCase(), value: letter});
        }

        this.store.loadData(data);
    },

    /**
     * Refreshes the view by reloading the data from the store and re-rendering the template.
     */
    refresh: function() {
        if (!this.rendered) {
            return;
        }

        var el = this.getTemplateTarget(),
            records = this.getRenderRecords();
        if (records.length < 1) {
            this.all.clear();
        } else {
            var tplData = this.collectData(records, 0);

            if (this.listPrefix.length > 0) {
                tplData.unshift({
                    key: '',
                    value: this.listPrefix
                });
            }
            
            this.tpl.overwrite(el, tplData);
            this.all.fill(Ext.query(this.itemSelector, el.dom));
        }

        this.updateItems(0);
        this.fireEvent('refresh', this, records);
    },

    // @private
    initEvents : function() {
        Ext.IndexBar.superclass.initEvents.call(this);

        this.mon(this.body, {
            touchstart: this.onTouchStart,
            touchend: this.onTouchEnd,
            touchmove: this.onTouchMove,
            scope: this
        });
    },

    // @private
    onTouchStart : function(e, t) {
        this.el.addClass(this.cmpCls + '-pressed');
        this.pageBox = this.body.getPageBox();
        this.onTouchMove(e);
    },

    // @private
    onTouchEnd : function(e, t) {
        this.el.removeClass(this.cmpCls + '-pressed');
    },

    // @private
    onTouchMove : function(e) {
        var target,
            record,
            pageBox = this.pageBox;
            
        if (!pageBox) {
            pageBox = this.pageBox = this.body.getPageBox();
        }

        if (this.vertical) {
            if (e.pageY > pageBox.bottom || e.pageY < pageBox.top) {
                return;
            }
            target = Ext.Element.fromPoint(pageBox.left + (pageBox.width / 2), e.pageY);
        }
        else if (this.horizontal) {
            if (e.pageX > pageBox.right || e.pageX < pageBox.left) {
                return;
            }
            target = Ext.Element.fromPoint(e.pageX, pageBox.top + (pageBox.height / 2));
        }

        if (target) {
            record = this.getRecord(target.dom);
            if (record) {
                this.fireEvent('index', record, target, this.indexOf(target));
            }
        }
    }
});

Ext.reg('indexbar', Ext.IndexBar);

Ext.regModel('IndexBarModel', {
    fields: ['key', 'value']
});
