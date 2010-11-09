/**
 * @class Ext.StoreMgr
 * @extends Ext.util.MixedCollection
 * The default global group of stores.
 * @singleton
 * TODO: Make this an AbstractMgr
 */
Ext.StoreMgr = Ext.apply(new Ext.util.MixedCollection(), {
    /**
     * @cfg {Object} listeners @hide
     */

    /**
     * Registers one or more Stores with the StoreMgr. You do not normally need to register stores
     * manually.  Any store initialized with a {@link Ext.data.Store#storeId} will be auto-registered. 
     * @param {Ext.data.Store} store1 A Store instance
     * @param {Ext.data.Store} store2 (optional)
     * @param {Ext.data.Store} etc... (optional)
     */
    register : function() {
        for (var i = 0, s; (s = arguments[i]); i++) {
            this.add(s);
        }
    },

    /**
     * Unregisters one or more Stores with the StoreMgr
     * @param {String/Object} id1 The id of the Store, or a Store instance
     * @param {String/Object} id2 (optional)
     * @param {String/Object} etc... (optional)
     */
    unregister : function() {
        for (var i = 0, s; (s = arguments[i]); i++) {
            this.remove(this.lookup(s));
        }
    },

    /**
     * Gets a registered Store by id
     * @param {String/Object} id The id of the Store, or a Store instance
     * @return {Ext.data.Store}
     */
    lookup : function(id) {
        if (Ext.isArray(id)) {
            var fields = ['field1'], expand = !Ext.isArray(id[0]);
            if(!expand){
                for(var i = 2, len = id[0].length; i <= len; ++i){
                    fields.push('field' + i);
                }
            }
            return new Ext.data.ArrayStore({
                data  : id,
                fields: fields,
                expandData : expand,
                autoDestroy: true,
                autoCreated: true
            });
        }
        return Ext.isObject(id) ? (id.events ? id : Ext.create(id, 'store')) : this.get(id);
    },

    // getKey implementation for MixedCollection
    getKey : function(o) {
         return o.storeId;
    }
});

/**
 * <p>Creates a new store for the given id and config, then registers it with the {@link Ext.StoreMgr Store Mananger}. 
 * Sample usage:</p>
<pre><code>
Ext.regStore('AllUsers', {
    model: 'User'
});

//the store can now easily be used throughout the application
new Ext.List({
    store: 'AllUsers',
    ... other config
});
</code></pre>
 * @param {String} id The id to set on the new store
 * @param {Object} config The store config
 * @param {Constructor} cls The new Component class.
 * @member Ext
 * @method regStore
 */
Ext.regStore = function(id, store) {
    if (store == undefined) {
        store = id;
    } else {
        store.storeId = id;
    }
    
    if (!(store instanceof Ext.data.Store)) {
        store = new Ext.data.Store(store);
    }
    
    return Ext.StoreMgr.register(store);
};