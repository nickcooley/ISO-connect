/**
 * @class Ext.util.Filter
 * @extends Object
 * <p>Represents a filter that can be applied to a {@link Ext.data.MixedCollection MixedCollection}. Can either simply
 * filter on a property/value pair or pass in a filter function with custom logic. Filters are always used in the context
 * of MixedCollections, though {@link Ext.data.Store Store}s frequently create them when filtering and searching on their
 * records. Example usage:</p>
<pre><code>
//set up a fictional MixedCollection containing a few people to filter on
var allNames = new Ext.util.MixedCollection();
allNames.addAll([
    {id: 1, name: 'Ed',    age: 25},
    {id: 2, name: 'Jamie', age: 37},
    {id: 3, name: 'Abe',   age: 32},
    {id: 4, name: 'Aaron', age: 26},
    {id: 5, name: 'David', age: 32}
]);

var ageFilter = new Ext.util.Filter({
    property: 'age',
    value   : 32
});

var longNameFilter = new Ext.util.Filter({
    filter: function(item) {
        return item.name.length > 4;
    }
});

//a new MixedCollection with the 3 names longer than 4 characters
var longNames = allNames.filter(longNameFilter);

//a new MixedCollection with the 2 people of age 24:
var youngFolk = allNames.filter(ageFilter);
</code></pre>
 * @constructor
 * @param {Object} config Config object
 */
Ext.util.Filter = Ext.extend(Object, {
    /**
     * @cfg {String} property The property to filter on. Required unless a {@link #filter} is passed
     */
    
    /**
     * @cfg {Function} filter A custom filter function which is passed each item in the {@link Ext.util.MixedCollection} 
     * in turn. Should return true to accept each item or false to reject it
     */
    
    /**
     * @cfg {Boolean} anyMatch True to allow any match - no regex start/end line anchors will be added. Defaults to false
     */
    anyMatch: false,
    
    /**
     * @cfg {Boolean} exactMatch True to force exact match (^ and $ characters added to the regex). Defaults to false.
     * Ignored if anyMatch is true.
     */
    exactMatch: false,
    
    /**
     * @cfg {Boolean} caseSensitive True to make the regex case sensitive (adds 'i' switch to regex). Defaults to false.
     */
    caseSensitive: false,
    
    /**
     * @cfg {String} root Optional root property. This is mostly useful when filtering a Store, in which case we set the
     * root to 'data' to make the filter pull the {@link #property} out of the data object of each item
     */
    
    constructor: function(config) {
        Ext.apply(this, config);
        
        if (this.filter == undefined) {
            if (this.property == undefined || this.value == undefined) {
                throw "A filter requires either a property or a filter function to be set";
            } else {
                this.filter = this.createFilterFn();
            }
        }
    },
    
    /**
     * @private
     * Creates a filter function for the configured property/value/anyMatch/caseSensitive options for this Filter
     */
    createFilterFn: function() {
        var me       = this,
            matcher  = me.createValueMatcher(),
            property = me.property;
        
        return function(item) {
            return matcher.test(me.getRoot.call(me, item)[property]);
        };
    },
    
    /**
     * @private
     * Returns the root property of the given item, based on the configured {@link #root} property
     * @param {Object} item The item
     * @return {Object} The root property of the object
     */
    getRoot: function(item) {
        return this.root == undefined ? item : item[this.root];
    },
    
    /**
     * @private
     * Returns a regular expression based on the given value and matching options
     */
    createValueMatcher : function() {
        var me            = this,
            value         = me.value,
            anyMatch      = me.anyMatch,
            exactMatch    = me.exactMatch,
            caseSensitive = me.caseSensitive,
            escapeRe      = Ext.util.Format.escapeRegex;
        
        if (!value.exec) { // not a regex
            value = String(value);

            if (anyMatch === true) {
                value = escapeRe(value);
            } else {
                value = '^' + escapeRe(value);
                if (exactMatch === true) {
                    value += '$';
                }
            }
            value = new RegExp(value, caseSensitive ? '' : 'i');
         }
         
         return value;
    }
});