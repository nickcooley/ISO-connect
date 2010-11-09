/**
 * @class Ext.data.Reader
 * @extends Object
 * <p>Readers are used to interpret data to be loaded into a {@link Ext.data.Model Model} instance or a {@link Ext.data.Store Store}
 * - usually in response to an AJAX request. This is normally handled transparently by passing some configuration to either the 
 * {@link Ext.data.Model Model} or the {@link Ext.data.Store Store} in question - see their documentation for further details.</p>
 * 
 * <p><u>Loading Nested Data</u></p>
 * 
 * <p>Readers have the ability to automatically load deeply-nested data objects based on the {@link Ext.data.Association associations}
 * configured on each Model. Below is an example demonstrating the flexibility of these associations in a fictional CRM system which
 * manages a User, their Orders, OrderItems and Products. First we'll define the models:
 * 
<pre><code>
Ext.regModel("User", {
    fields: [
        'id', 'name'
    ],

    hasMany: {model: 'Order', name: 'orders'},

    proxy: {
        type: 'rest',
        url : 'users.json',
        reader: {
            type: 'json',
            root: 'users'
        }
    }
});

Ext.regModel("Order", {
    fields: [
        'id', 'total'
    ],

    hasMany  : {model: 'OrderItem', name: 'orderItems', associationKey: 'order_items'},
    belongsTo: 'User'
});

Ext.regModel("OrderItem", {
    fields: [
        'id', 'price', 'quantity', 'order_id', 'product_id'
    ],

    belongsTo: ['Order', {model: 'Product', associationKey: 'product'}]
});

Ext.regModel("Product", {
    fields: [
        'id', 'name'
    ],

    hasMany: 'OrderItem'
});
</code></pre>
 * 
 * <p>This may be a lot to take in - basically a User has many Orders, each of which is composed of several OrderItems. Finally,
 * each OrderItem has a single Product. This allows us to consume data like this:</p>
 * 
<pre><code>
{
    "users": [
        {
            "id": 123,
            "name": "Ed",
            "orders": [
                {
                    "id": 50,
                    "total": 100,
                    "order_items": [
                        {
                            "id"      : 20,
                            "price"   : 40,
                            "quantity": 2,
                            "product" : {
                                "id": 1000,
                                "name": "MacBook Pro"
                            }
                        },
                        {
                            "id"      : 21,
                            "price"   : 20,
                            "quantity": 3,
                            "product" : {
                                "id": 1001,
                                "name": "iPhone"
                            }
                        }
                    ]
                }
            ]
        }
    ]
}
</code></pre>
 * 
 * <p>The JSON response is deeply nested - it returns all Users (in this case just 1 for simplicity's sake), all of the Orders
 * for each User (again just 1 in this case), all of the OrderItems for each Order (2 order items in this case), and finally
 * the Product associated with each OrderItem. Now we can read the data and use it as follows:
 * 
<pre><code>
var store = new Ext.data.Store({
    model: "User"
});

store.load({
    callback: function() {
        //the user that was loaded
        var user = store.first();

        console.log("Orders for " + user.get('name') + ":")

        //iterate over the User's Orders
        user.orders().each(function(order) {
            console.log("Order ID: " + order.getId() + ", which contains items:");

            //iterate over the Order's OrderItems
            order.orderItems().each(function(orderItem) {
                //we know that the Product's data is already loaded, so we can use the synchronous getProduct
                //usually, we would use the asynchronous version (see {@link Ext.data.BelongsToAssociation})
                var product = orderItem.getProduct();

                console.log(orderItem.get('quantity') + ' orders of ' + product.get('name'));
            });
        });
    }
});
</code></pre>
 * 
 * <p>Running the code above results in the following:</p>
 * 
<pre><code>
Orders for ed:
Order ID: 50, which contains items:
2 orders of MacBookPro
3 orders of iPhone
</code></pre>
 * 
 * @constructor
 * @param {Object} config Optional config object
 */
Ext.data.Reader = Ext.extend(Object, {
    /**
     * @cfg {String} idProperty Name of the property within a row object
     * that contains a record identifier value.  Defaults to <tt>id</tt>
     */
    idProperty: 'id',

    /**
     * @cfg {String} totalProperty Name of the property from which to
     * retrieve the total number of records in the dataset. This is only needed
     * if the whole dataset is not passed in one go, but is being paged from
     * the remote server.  Defaults to <tt>total</tt>.
     */
    totalProperty: 'total',

    /**
     * @cfg {String} successProperty Name of the property from which to
     * retrieve the success attribute. Defaults to <tt>success</tt>.  See
     * {@link Ext.data.DataProxy}.{@link Ext.data.DataProxy#exception exception}
     * for additional information.
     */
    successProperty: 'success',

    /**
     * @cfg {String} root <b>Required</b>.  The name of the property
     * which contains the Array of row objects.  Defaults to <tt>undefined</tt>.
     * An exception will be thrown if the root property is undefined. The data
     * packet value for this property should be an empty array to clear the data
     * or show no data.
     */
    root: '',
    
    /**
     * @cfg {Boolean} implicitIncludes True to automatically parse models nested within other models in a JSON
     * object. See JsonReader intro docs for full explanation. Defaults to true.
     */
    implicitIncludes: true,

    constructor: function(config) {
        Ext.apply(this, config || {});

        this.model = Ext.ModelMgr.getModel(config.model);
        if (this.model) {
            this.buildExtractors();
        }
    },

    /**
     * Sets a new model for the reader.
     * @private
     * @param {Object} model The model to set.
     * @param {Boolean} setOnProxy True to also set on the Proxy, if one is configured
     */
    setModel: function(model, setOnProxy) {
        this.model = Ext.ModelMgr.getModel(model);
        this.buildExtractors(true);
        
        if (setOnProxy && this.proxy) {
            this.proxy.setModel(this.model, true);
        }
    },

    /**
     * Reads the given response object. This method normalizes the different types of response object that may be passed
     * to it, before handing off the reading of records to the {@link readRecords} function.
     * @param {Object} response The response object. This may be either an XMLHttpRequest object or a plain JS object
     * @return {Ext.data.ResultSet} The parsed ResultSet object
     */
    read: function(response) {
        var data = response;

        if (response.responseText) {
            data = this.getResponseData(response);
        }

        return this.readRecords(data);
    },

    /**
     * Abstracts common functionality used by all Reader subclasses. Each subclass is expected to call
     * this function before running its own logic and returning the Ext.data.ResultSet instance. For most
     * Readers additional processing should not be needed.
     * @param {Mixed} data The raw data object
     * @return {Ext.data.ResultSet} A ResultSet object
     */
    readRecords: function(data) {
        /**
         * The raw data object that was last passed to readRecords. Stored for further processing if needed
         * @property rawData
         * @type Mixed
         */
        this.rawData = data;

        data = this.getData(data);

        var root    = this.getRoot(data),
            total   = root.length,
            success = true,
            value, records, recordCount;

        if (this.totalProperty) {
            value = parseInt(this.getTotal(data), 10);
            if (!isNaN(value)) {
                total = value;
            }
        }

        if (this.successProperty) {
            value = this.getSuccess(data);
            if (value === false || value === 'false') {
                success = false;
            }
        }

        records = this.extractData(root, true);
        recordCount = records.length;

        return new Ext.data.ResultSet({
            total  : total || recordCount,
            count  : recordCount,
            records: records,
            success: success
        });
    },

    /**
     * Returns extracted, type-cast rows of data.  Iterates to call #extractValues for each row
     * @param {Object[]/Object} data-root from server response
     * @param {Boolean} returnRecords [false] Set true to return instances of Ext.data.Record
     * @private
     */
    extractData : function(root, returnRecords) {
        var values  = [],
            records = [],
            Model   = this.model,
            length  = root.length,
            idProp  = this.idProperty,
            node, id, record, i;

        for (i = 0; i < length; i++) {
            node   = root[i];
            values = this.extractValues(node);
            id     = this.getId(node);

            if (returnRecords === true) {
                record = new Model(values, id);
                record.raw = node;
                records.push(record);
                
                if (this.implicitIncludes) {
                    this.readAssociated(record, node);
                }
            } else {
                values[idProp] = id;
                records.push(values);
            }
        }

        return records;
    },
    
    /**
     * @private
     * Loads a record's associations from the data object. This prepopulates hasMany and belongsTo associations
     * on the record provided.
     * @param {Ext.data.Model} record The record to load associations for
     * @param {Mixed} data The data object
     * @return {String} Return value description
     */
    readAssociated: function(record, data) {
        var associations = record.associations.items,
            length       = associations.length,
            association, associationName, associationData, proxy, reader, store, i;
        
        for (i = 0; i < length; i++) {
            association     = associations[i];
            associationName = association.name;
            associationData = data[association.associationKey || associationName];
            
            if (associationData) {
                proxy = association.associatedModel.getProxy();
                
                // if the associated model has a Reader already, use that
                if (proxy) {
                    reader = proxy.getReader();
                }
                
                // otherwise try to create a sensible Reader now
                if (!reader) {
                    reader = new this.constructor({
                        model: association.associatedName
                    });
                    
                    if (association.type == 'hasMany') {
                        store = record[associationName]();
                        
                        store.add.apply(store, reader.read(associationData).records);
                    } else if (association.type == 'belongsTo') {
                        record[associationName + "BelongsToInstance"] = reader.read([associationData]).records[0];
                    }
                }
            }
        }
    },

    /**
     * @private
     * Given an object representing a single model instance's data, iterates over the model's fields and
     * builds an object with the value for each field.
     * @param {Object} data The data object to convert
     * @return {Object} Data object suitable for use with a model constructor
     */
    extractValues: function(data) {
        var fields = this.model.prototype.fields.items,
            length = fields.length,
            output = {},
            field, value, i;

        for (i = 0; i < length; i++) {
            field = fields[i];
            value = this.extractorFunctions[i](data) || field.defaultValue;

            output[field.name] = value;
        }

        return output;
    },

    /**
     * @private
     * By default this function just returns what is passed to it. It can be overridden in a subclass
     * to return something else. See XmlReader for an example.
     * @param {Object} data The data object
     * @return {Object} The normalized data object
     */
    getData: function(data) {
        return data;
    },

    /**
     * @private
     * This will usually need to be implemented in a subclass. Given a generic data object (the type depends on the type
     * of data we are reading), this function should return the object as configured by the Reader's 'root' meta data config.
     * See XmlReader's getRoot implementation for an example. By default the same data object will simply be returned.
     * @param {Mixed} data The data object
     * @return {Mixed} The same data object
     */
    getRoot: function(data) {
        return data;
    },

    /**
     * Takes a raw response object (as passed to this.read) and returns the useful data segment of it. This must be implemented by each subclass
     * @param {Object} response The responce object
     * @return {Object} The useful data from the response
     */
    getResponseData: function(response) {
        throw new Error("getResponseData must be implemented in the Ext.data.Reader subclass");
    },

    /**
     * @private
     * Reconfigures the meta data tied to this Reader
     */
    onMetaChange : function(meta) {
        var fields = meta.fields,
            newModel;
        
        Ext.apply(this, meta);
        
        if (fields) {
            newModel = Ext.regModel("JsonReader-Model" + Ext.id(), {fields: fields});
            this.setModel(newModel, true);
        } else {
            this.buildExtractors(true);
        }
    },

    /**
     * @private
     * This builds optimized functions for retrieving record data and meta data from an object.
     * Subclasses may need to implement their own getRoot function.
     * @param {Boolean} force True to automatically remove existing extractor functions first (defaults to false)
     */
    buildExtractors: function(force) {
        if (force === true) {
            delete this.extractorFunctions;
        }
        
        if (this.extractorFunctions) {
            return;
        }

        var idProp      = this.id || this.idProperty,
            totalProp   = this.totalProperty,
            successProp = this.successProperty,
            messageProp = this.messageProperty;

        //build the extractors for all the meta data
        if (totalProp) {
            this.getTotal = this.createAccessor(totalProp);
        }

        if (successProp) {
            this.getSuccess = this.createAccessor(successProp);
        }

        if (messageProp) {
            this.getMessage = this.createAccessor(messageProp);
        }

        if (idProp) {
            var accessor = this.createAccessor(idProp);

            this.getId = function(record) {
                var id = accessor(record);

                return (id == undefined || id == '') ? null : id;
            };
        } else {
            this.getId = function() {
                return null;
            };
        }
        this.buildFieldExtractors();
    },

    /**
     * @private
     */
    buildFieldExtractors: function() {
        //now build the extractors for all the fields
        var fields = this.model.prototype.fields.items,
            ln = fields.length,
            i  = 0,
            extractorFunctions = [],
            field, map;

        for (; i < ln; i++) {
            field = fields[i];
            map   = (field.mapping !== undefined && field.mapping !== null) ? field.mapping : field.name;

            extractorFunctions.push(this.createAccessor(map));
        }

        this.extractorFunctions = extractorFunctions;
    }
});