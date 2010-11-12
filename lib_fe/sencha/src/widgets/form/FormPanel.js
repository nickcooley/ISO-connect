/**
 * @class Ext.form.FormPanel
 * @extends Ext.Panel
 * <p>Simple form panel which enables easy getting and setting of field values. Can load model instances. Example usage:</p>
<pre><code>
var form = new Ext.form.FormPanel({
    items: [
        {
            xtype: 'textfield',
            name : 'first',
            label: 'First name'
        },
        {
            xtype: 'textfield',
            name : 'last',
            label: 'Last name'
        },
        {
            xtype: 'numberfield',
            name : 'age',
            label: 'Age'
        },
        {
            xtype: 'urlfield',
            name : 'url',
            label: 'Website'
        }
    ]
});
</code></pre>
 * <p>Loading model instances:</p>
<pre><code>
Ext.regModel('User', {
    fields: [
        {name: 'first', type: 'string'},
        {name: 'last',  type: 'string'},
        {name: 'age',   type: 'int'},
        {name: 'url',   type: 'string'}
    ]
});

var user = Ext.ModelMgr.create({
    first: 'Ed',
    last : 'Spencer',
    age  : 24,
    url  : 'http://extjs.com'
}, 'User');

form.load(user);
</code></pre>
 * @xtype form
 */
Ext.form.FormPanel = Ext.extend(Ext.Panel, {
    /**
     * @cfg {Boolean} standardSubmit
     * Wether or not we want to perform a standard form submit. Defaults to false/
     */
    standardSubmit: false,

    cmpCls: 'x-form',
    
    /**
     * @cfg {String} url
     * The default Url for submit actions
     */
    url : undefined,
    
    /**
     * @cfg {Object} baseParams
     * Optional hash of params to be sent (when standardSubmit configuration is false) on every submit.
     */
    baseParams : undefined,
    
    /**
     * @cfg {Object} waitTpl
     * The defined {@link #waitMsg} template.  Used for precise control over the masking agent used
     * to mask the FormPanel (or other Element) during form Ajax/submission actions. For more options, see
     * {@link #showMask} method.
     */
    waitTpl: new Ext.XTemplate(
        '<div class="{cls}">{message}&hellip;</div>'
    ),

    getElConfig : function() {
        return Ext.apply(Ext.form.FormPanel.superclass.getElConfig.call(this), {
            tag: 'form'
        });
    },
    
    // @private
    initComponent : function() {
        this.addEvents(
           /**
             * @event submit
             * Fires upon successful (Ajax-based) form submission
             * @param {Ext.FormPanel} this This FormPanel
             * @param {Object} result The result object as returned by the server
             */
            'submit', 
           /**
             * @event beforesubmit
             * Fires immediately preceding any Form submit action.
             * Implementations may adjust submitted form values or options prior to execution.
             * A return value of <tt>false</tt> from this listener will abort the submission 
             * attempt (regardless of standardSubmit configuration) 
             * @param {Ext.FormPanel} this This FormPanel
             * @param {Object} values A hash collection of the qualified form values about to be submitted
             * @param {Object} options Submission options hash (only available when standardSubmit is false) 
             */
             'beforesubmit', 
           /**
             * @event exception
             * Fires when either the Ajax HTTP request reports a failure OR the server returns a success:false
             * response in the result payload.
             * @param {Ext.FormPanel} this This FormPanel
             * @param {Object} result Either a failed Ext.data.Connection request object or a failed (logical) server
             * response payload.
             */
             'exception'
        );
        Ext.form.FormPanel.superclass.initComponent.call(this);
    },

    // @private
    afterRender : function() {
        Ext.form.FormPanel.superclass.afterRender.call(this);
        this.el.on('submit', this.onSubmit, this);
    },

    // @private
    onSubmit : function(e, t) {
        if (!this.standardSubmit || this.fireEvent('beforesubmit', this, this.getValues(true)) === false) {
            if (e) {
                e.stopEvent();
            }       
        }
    },
    
    /**
     * Performs a Ajax-based submission of form values (if standardSubmit is false) or otherwise 
     * executes a standard HTML Form submit action.
     * @param {Object} options Unless otherwise noted, options may include the following:
     * <ul>
     * <li><b>url</b> : String
     * <div class="sub-desc">
     * The url for the action (defaults to the form's {@link #url url}.)
     * </div></li>
     *
     * <li><b>method</b> : String
     * <div class="sub-desc">
     * The form method to use (defaults to the form's method, or POST if not defined)
     * </div></li>
     *
     * <li><b>params</b> : String/Object
     * <div class="sub-desc">
     * The params to pass
     * (defaults to the FormPanel's baseParams, or none if not defined)
     * Parameters are encoded as standard HTTP parameters using {@link Ext#urlEncode}.
     * </div></li>
     *
     * <li><b>headers</b> : Object
     * <div class="sub-desc">
     * Request headers to set for the action
     * (defaults to the form's default headers)
     * </div></li>
     * 
     * <li><b>autoAbort</b> : Boolean
     * <div class="sub-desc">
     * <tt>true</tt> to abort any pending Ajax request prior to submission (defaults to false)
     * Note: Has no effect when standardSubmit is enabled.
     * </div></li>
     * 
     * <li><b>submitDisabled</b> : Boolean
     * <div class="sub-desc">
     * <tt>true</tt> to submit all fields regardless of disabled state (defaults to false)
     * Note: Has no effect when standardSubmit is enabled.
     * </div></li>
     *
     * <li><b>waitMsg</b> : String/Config
     * <div class="sub-desc">
     * If specified, the value is applied to the {@link #waitTpl} if defined, and rendered to the
     * {@link #waitMsgTarget} prior to a Form submit action.
     * </div></li>
     * 
     * <li><b>success</b> : Function
     * <div class="sub-desc">
     * The callback that will be invoked after a successful response 
     * 
     *  The function is passed the following parameters:
     *
      o      * form : Ext.FormPanel The form that requested the action
      o      * result : The result object returned by the server as a result of the submit request.
     * </div></li>
     *
     * <li><b>failure</b> : Function
     * <div class="sub-desc">
     * The callback that will be invoked after a
     * failed transaction attempt. The function is passed the following parameters:
     *     form : The Ext.FormPanel that requested the submit.
     *     result : The failed response or result object returned by the server which performed the operation.
     * </div></li>
     * 
     * <li><b>scope</b> : Object
     * <div class="sub-desc">
     * The scope in which to call the callback functions (The this reference for the callback functions).
     * </div></li>
     * </ul>
     *
     * @return {Ext.data.Connection} request Object
     */

    submit : function(options) {
        var form = this.el.dom || {},
            O = Ext.apply({
               url : this.url || form.action,
               submitDisabled : false,
               method : form.method || 'post',
               autoAbort : false,
               params : null,
               waitMsg : null,
               headers : null,
               success : null,
               failure : null
            }, options || {}),
            formValues = this.getValues(this.standardSubmit || !O.submitDisabled);
        
        if (this.standardSubmit) {
            if (form) {
                if (O.url && Ext.isEmpty(form.action)) {
                    form.action = O.url;
                }
                form.method = (O.method || form.method).toLowerCase();
                form.submit();
            }
            return null;
        }
        if (this.fireEvent('beforesubmit', this, formValues, options ) !== false) {
            if (O.waitMsg) {
                this.showMask(O.waitMsg);
            }
            
            return Ext.Ajax.request({
                url     : O.url,
                method  : O.method,
                rawData : Ext.urlEncode(Ext.apply(
                    Ext.apply({},this.baseParams || {}),
                    O.params || {},
                    formValues
                  )),
                autoAbort : O.autoAbort,
                headers  : Ext.apply(
                   {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    O.headers || {}),
                scope    : this,
                callback : function(options, success, response) {
                     var R = response;
                     this.hideMask();   
                        
                     if (success) {
                          R = Ext.decode(R.responseText);
                          success = !!R.success;
                          if (success) {
                              if (typeof O.success == 'function') {
                                 O.scope ? O.success.call(O.scope, this, R) : O.success(this, R);
                              }
                              this.fireEvent('submit', this, R);
                              return;
                          }
                     }
                    if (typeof O.failure == 'function') {
                        O.scope ? O.failure.call(O.scope, this, R) : O.failure(this, R);
                    }
                    this.fireEvent('exception', this, R);
                }
            });
        }
    },

    /**
     * Loads matching fields from a model instance into this form
     * @param {Ext.data.Model} instance The model instance
     * @return {Ext.form.FormPanel} this
     */
    loadRecord: function(instance) {
        if (instance && instance.data) {
            this.setValues(instance.data);
            
            /**
             * @property record
             * @type Ext.data.Model
             * The Model instance currently loaded into this form (if any). Read only
             */
            this.record = instance;
        }
        
        return this;
    },
    
    /**
     * @private
     * Backwards-compatibility for a poorly-named function
     */
    loadModel: function() {
        return this.loadRecord.apply(this, arguments);
    },
    
    /**
     * Returns the Model instance currently loaded into this form (if any)
     * @return {Ext.data.Model} The Model instance
     */
    getRecord: function() {
        return this.record;
    },
    
    /**
     * Updates a model instance with the current values of this form
     * @param {Ext.data.Model} instance The model instance
     * @param {Boolean} enabled <tt>true</tt> to update the Model with values from enabled fields only
     * @return {Ext.form.FormPanel} this
     */
    updateModel: function(instance, enabled) {
        var fields, values, name;
        
        if(instance && (fields = instance.fields)){
            values = this.getValues(enabled);
            for (name in values) {
                if(values.hasOwnProperty(name) && fields.containsKey(name)){
                   instance.set(name, values[name]);     
                }
            }
        }
        return this;
         
    },

    /**
     * Sets the values of form fields in bulk. Example usage:
<pre><code>
myForm.setValues({
    name: 'Ed',
    crazy: true,
    username: 'edspencer'
});
</code></pre>
     * @param {Object} values field name => value mapping object
     * @return {Ext.form.FormPanel} this
     */
    setValues: function(values) {
         var fields = this.getFields(),
            name, field;
        values = values || {};
        for (name in values) {
            if (values.hasOwnProperty(name) && name in fields) {
                field = fields[name];
                field.setValue && field.setValue(values[name]);
            }       
        }
        return this;
    },

    /**
     * Returns an object containing the value of each field in the form, keyed to the field's name
     * @param {Boolean} enabled <tt>true</tt> to return only enabled fields
     * @return {Object} Object mapping field name to its value
     */
    getValues: function(enabled) {
        var fields = this.getFields(),
            field,
            values = {},
            name;

        for (name in fields) {
            if (fields.hasOwnProperty(name)) {
                field = fields[name];
                if (enabled && field.disabled) {
                    continue;
                }
                if (field.getValue) {
                    values[name] = field.getGroupValue ? field.getGroupValue() : field.getValue();
                }
            }
        }

        return values;

    },

    /**
     * Resets all fields in the form back to their original values
     */
    reset: function() {
        var fields = this.getFields(),
            name;
        for (name in fields) {
            if(fields.hasOwnProperty(name)){
                fields[name].reset();
            }
        }
    },

    /**
     * @private
     * Returns all {@link Ext.Field field} instances inside this form
     * @return {Object} All field instances, mapped by field name
     */
    getFields: function() {
        var fields = {};

        var getFieldsFrom = function(item) {
            if (item.isField) {
                fields[item.getName()] = item;
            }

            if (item.isContainer) {
                item.items.each(getFieldsFrom);
            }
        };

        this.items.each(getFieldsFrom);
        return fields;
    },
    /**
     * Shows a generic/custom mask over a designated Element.
     * @param {String/Object} cfg Either a string message or a configuration object supporting
     * the following options:
<pre><code>
    {        
           message : 'Please Wait',
       transparent : false,
           target  : Ext.getBody(),  //optional target Element
               cls : 'form-mask',
    customImageUrl : 'trident.jpg'
    }
</code></pre>This object is passed to the {@link #waitTpl} for use with a custom masking implementation.
     * @param {String/Element} target The target Element instance or Element id to use
     * as the masking agent for the operation (defaults the container Element of the component)
     * @return {Ext.form.FormPanel} this
     */
    showMask : function(cfg, target){
        
        cfg = Ext.isString(cfg)? {message : cfg, transparent : false} : cfg; 
        
        if(cfg && this.waitTpl){
            this.maskTarget = target = Ext.get(target || cfg.target) || this.el;
            target && target.mask(!!cfg.transparent, this.waitTpl.apply(cfg));
        }
        return this;
    },
    
    /**
     * Hides a previously shown wait mask (See {@link #showMask})
     * @return {Ext.form.FormPanel} this
     */
    hideMask : function(){
        if(this.maskTarget){
            this.maskTarget.unmask();
            delete this.maskTarget;
        }
        return this;
    }
});

 /**
     * (Shortcut to {@link #loadModel} method) Loads matching fields from a model instance into this form
     * @param {Ext.data.Model} instance The model instance
     * @return {Ext.form.FormPanel} this
     */
Ext.form.FormPanel.prototype.load = Ext.form.FormPanel.prototype.loadModel; 
Ext.reg('form', Ext.form.FormPanel);
