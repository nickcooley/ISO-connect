/**
 * @class Ext.data.PolymorphicAssociation
 * @extends Ext.data.Association
 * @ignore
 */
Ext.data.PolymorphicAssociation = Ext.extend(Ext.data.Association, {

    constructor: function(config) {
        Ext.data.PolymorphicAssociation.superclass.constructor.call(this, config);
        
        var ownerProto = this.ownerModel.prototype,
            name       = this.name;
        
        Ext.applyIf(this, {
            associationIdField: this.ownerName.toLowerCase() + "_id"
        });
        
        ownerProto[name] = this.createStore();
    },

    /**
     * @private
     * Creates the association function that will be injected on the ownerModel. Most of what this is doing
     * is filtering the dataset down to the appropriate model/id combination, and adding modelDefaults to
     * any model instances that are created/inserted into the generated store.
     * @return {Function} The store-generating function
     */
    createStore: function() {
        var association           = this,
            ownerName             = this.ownerName,
            storeName             = this.name + "Store",
            associatedModel       = this.associatedModel,
            primaryKey            = this.primaryKey,
            associationIdField    = 'associated_id',
            associationModelField = 'associated_model';
        
        return function() {
            var me = this,
                modelDefaults = {},
                config, filters;
                
            if (me[storeName] == undefined) {
                filters = [
                    {
                        property  : associationIdField,
                        value     : me.get(primaryKey),
                        exactMatch: true
                    },
                    {
                        property  : associationModelField,
                        value     : ownerName,
                        exactMatch: true
                    }
                ];
                
                modelDefaults[associationIdField] = me.get(primaryKey);
                modelDefaults[associationModelField] = ownerName;
                
                config = Ext.apply({}, association.storeConfig || {}, {
                    model        : associatedModel,
                    filters      : filters,
                    remoteFilter : false,
                    modelDefaults: modelDefaults
                });
                
                me[storeName] = new Ext.data.Store(config);
            }
            
            return me[storeName];
        };
    }
});