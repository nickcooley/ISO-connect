/**
 * @class Ext.form.Field
 * @extends Ext.Container
 * <p>Base class for form fields that provides default event handling, sizing, value handling and other functionality. Ext.form.Field
 * is not used directly in applications, instead the subclasses such as {@link Ext.form.TextField} should be used.</p>
 * @constructor
 * Creates a new Field
 * @param {Object} config Configuration options
 * @xtype field
 */
Ext.form.Field = Ext.extend(Ext.Component,  {
    ui: 'text',

    /**
     * Set to true on all Ext.form.Field subclasses. This is used by {@link Ext.form.FormPanel#getValues} to determine which
     * components inside a form are fields.
     * @property isField
     * @type Boolean
     */
    isField: true,

    /**
     * <p>The label Element associated with this Field. <b>Only available if a {@link #label} is specified.</b></p>
     * @type Ext.Element
     * @property labelEl
     */

    /**
     * @cfg {Number} tabIndex The tabIndex for this field. Note this only applies to fields that are rendered,
     * not those which are built via applyTo (defaults to undefined).
     */

    /**
     * @cfg {Mixed} value A value to initialize this field with (defaults to undefined).
     */

    /**
     * @cfg {String} name The field's HTML name attribute (defaults to '').
     * <b>Note</b>: this property must be set if this field is to be automatically included with
     * {@link Ext.form.BasicForm#submit form submit()}.
     */

    /**
     * @cfg {String} cls A custom CSS class to apply to the field's underlying element (defaults to '').
     */

    /**
     * @cfg {String} fieldCls The default CSS class for the field (defaults to 'x-form-field')
     */
    baseCls: 'x-field',

    /**
     * @cfg {String} inputCls Optional CSS class that will be added to the actual <input> element (or whichever different element is
     * defined by {@link inputAutoEl}). Defaults to undefined.
     */
    inputCls: undefined,

    /**
     * @cfg {String} focusCls The CSS class to use when the field receives focus (defaults to 'x-field-focus')
     */
    focusCls: 'x-field-focus',
    
    /**
     * @cfg {Integer} maxLength The maximum number of permitted input characters (defaults to 0).
     */
    maxLength: 0,
    
    /**
     * @cfg {String} placeHolder A string value displayed in the input (if supported) when the control is empty.
     */
    placeHolder: undefined,
    
    /**
     * True to set the field's DOM element autocomplete attribute to "on", false to set to "off". Defaults to undefined, leaving the attribute unset
     * @cfg {Boolean} autoComplete
     */
    autoComplete: undefined,
    
    /**
     * True to set the field's DOM element autocapitalize attribute to "on", false to set to "off". Defaults to undefined, leaving the attribute unset
     * @cfg {Boolean} autoCapitalize
     */
    autoCapitalize: undefined,
    
    /**
     * True to set the field DOM element autocorrect attribute to "on", false to set to "off". Defaults to undefined, leaving the attribute unset.
     * @cfg {Boolean} autoCorrect
     */
    autoCorrect: undefined,

    renderTpl: [
//        '<tpl if="label"><label <tpl if="fieldEl">for="{inputId}"</tpl> class="x-form-label"><span>{label}</span></label></tpl>',
        '<tpl if="label"><div class="x-form-label"><span>{label}</span></div></tpl>',
        '<tpl if="fieldEl">',
            '<div class="x-form-field-container"><input id="{inputId}" type="{inputType}" name="{name}" class="{fieldCls}"',
                '<tpl if="tabIndex">tabIndex="{tabIndex}" </tpl>',
                '<tpl if="placeHolder">placeholder="{placeHolder}" </tpl>',
                '<tpl if="style">style="{style}" </tpl>',
                '<tpl if="maxlength">maxlength="{maxlength}" </tpl>',
                '<tpl if="autoComplete">autocomplete="{autoComplete}" </tpl>',
                '<tpl if="autoCapitalize">autocapitalize="{autoCapitalize}" </tpl>',
                '<tpl if="autoCorrect">autocorrect="{autoCorrect}" </tpl> />',
            '<tpl if="maskField"><div class="x-field-mask"></div></tpl>',
            '</div>',
            '<tpl if="showClear"><div class="x-field-clear-container"><div class="x-field-clear x-hidden-visibility">&#215;</div><div></tpl>',
        '</tpl>',
    ],

    /**
     * @cfg {Boolean} disabled True to disable the field (defaults to false).
     * <p>Be aware that conformant with the <a href="http://www.w3.org/TR/html401/interact/forms.html#h-17.12.1">HTML specification</a>,
     * disabled Fields will not be {@link Ext.form.BasicForm#submit submitted}.</p>
     */
    disabled: false,

    // @private
    isFormField: true,

    /**
     * @property {Boolean} <tt>True</tt> if the field currently has focus.
     */
    isFocused: false,

    /**
     * @cfg {Boolean} autoCreateField True to automatically create the field input element on render. This is true by default, but should
     * be set to false for any Ext.Field subclasses that don't need an HTML input (e.g. Ext.Slider and similar)
     */
    autoCreateField: true,

    /**
     * @cfg {String} inputType The type attribute for input fields -- e.g. radio, text, password, file (defaults
     * to 'text'). The types 'file' and 'password' must be used to render those field types currently -- there are
     * no separate Ext components for those. Note that if you use <tt>inputType:'file'</tt>, {@link #emptyText}
     * is not supported and should be avoided.
     */
    inputType: 'text',
    
    /**
     * @cfg {String} label The label to associate with this field. Defaults to <tt>null</tt>.
     */
    label: null,
    
    labelWidth: 100, // Currently unsupported

    /**
     * @cfg {String} labelAlign The location to render the label of the field. Acceptable values are 'top' and 'left', defaults to 'left'
     */
    labelAlign: 'left',

    /**
     * @cfg {Boolean} required True to make this field required. Note: this only causes a visual indication. Doesn't prevent user from submitting the form.
     */
    required: false,

    maskField: false,

    // @private
    initComponent: function() {
        //backwards compatibility - deprecate in next major release
        this.label = this.label || this.fieldLabel;

        Ext.form.Field.superclass.initComponent.call(this);
        this.addEvents(
            /**
             * @event focus
             * Fires when this field receives input focus.
             * @param {Ext.form.Field} this
             */
            'focus',
            /**
             * @event blur
             * Fires when this field loses input focus.
             * @param {Ext.form.Field} this
             */
            'blur',
            /**
             * @event change
             * Fires just before the field blurs if the field value has changed.
             * @param {Ext.form.Field} this
             * @param {Mixed} newValue The new value
             * @param {Mixed} oldValue The original value
             */
            'change',
            /**
             * @event keyup
             * Fires when a key is released on the input element.
             * @param {Ext.form.Field} this
             * @param {Ext.EventObject} e
             */
            'keyup'
        );
        
        //<debug>
        if (Ext.isDefined(this.fieldClass)) {
            throw "Field: fieldClass has been deprecated. Please use fieldCls.";
        }
        //</debug>
        
        //<debug>
        if (Ext.isDefined(this.focusClass)) {
            throw "Field: focusClass has been deprecated. Please use focusCls.";
        }
        //</debug>
    },

    /**
     * Returns the {@link Ext.form.Field#name name} or {@link Ext.form.ComboBox#hiddenName hiddenName}
     * attribute of the field if available.
     * @return {String} name The field {@link Ext.form.Field#name name} or {@link Ext.form.ComboBox#hiddenName hiddenName}
     */
    getName: function() {
        return this.name || this.id || '';
    },

    /**
     * @private
     */
    applyRenderSelectors: function() {
        this.renderSelectors = Ext.applyIf(this.renderSelectors || {}, {
            mask: '.x-field-mask',
            labelEl: 'label',
            clearEl: '.x-field-clear',
            clearContainerEl: '.x-field-clear-container',
            fieldEl: '.' + Ext.util.Format.trim(this.renderData.fieldCls).replace(/ /g, '.')
        });
        Ext.form.Field.superclass.applyRenderSelectors.call(this);
    },
    
    initRenderData: function() {
        var renderData     = Ext.form.Field.superclass.initRenderData.call(this),
            autoComplete   = this.autoComplete,
            autoCapitalize = this.autoCapitalize,
            autoCorrect    = this.autoCorrect;
        
        Ext.applyIf(renderData, {
            disabled:   this.disabled,
            fieldCls:   'x-input-' + this.inputType + (this.inputCls ? ' ' + this.inputCls: ''),
            fieldEl:    !this.fieldEl && this.autoCreateField,
            inputId:    Ext.id(),
            label:      this.label,
            labelAlign: 'x-label-align-' + this.labelAlign,
            name:       this.name || this.id,
            placeHolder: this.placeHolder,
            required:   this.required,
            style:      this.style,
            tabIndex:   this.tabIndex,
            maxlength: this.maxLength,
            inputType:       this.inputType,
            maskField:  this.maskField,
            showClear:  this.showClear
        });
        
        var positive = /true|on/i;
        
        if (autoComplete !== undefined) {
            renderData.autoComplete = positive.test(autoComplete + '') ? 'on': 'off';
        }
        
        if (autoCapitalize !== undefined) {
            renderData.autoCapitalize = positive.test(autoCapitalize + '') ? 'on': 'off';
        }
        
        if (autoCorrect !== undefined) {
            renderData.autoCorrect = positive.test(autoCorrect + '') ? 'on': 'off';
        }
        
        this.renderData = renderData;
        return renderData;
    },
    
    onRender: function() {
        Ext.form.Field.superclass.onRender.apply(this, arguments);
        
        var cls = [];
        if (this.required) {
            cls.push('x-field-required');
        }
        if (this.label) {
            cls.push('x-label-align-' + this.labelAlign);
        }
        this.el.addCls(cls);
    },
    
    initEvents: function() {
        Ext.form.Field.superclass.initEvents.call(this);
        
        if (this.fieldEl) {
            this.mon(this.fieldEl, {
                focus: this.onFocus,
                blur: this.onBlur,
                keyup: this.onKeyUp,
                paste: this.checkClear,
                mousedown: this.onBeforeFocus,
                scope: this
            });

            if (this.maskField && this.mask) {
                this.mon(this.mask, {
                    click: this.onMaskTap,
                    scope: this
                });
            }
            
            if(this.clearEl){
                this.mon(this.clearContainerEl, {
                    scope: this,
                    tap: this.onClearTap    
                });
            }
        }        
    },

    // @private
    onEnable: function() {
        this.el.removeCls(this.disabledCls);
        this.el.dom.disabled = false;
        this.fieldEl.dom.disabled = false;
        this.checkClear();
    },

    // @private
    onDisable: function() {
        this.el.addCls(this.disabledCls);
        this.el.dom.disabled = true;
        this.fieldEl.dom.disabled = true;
        this.checkClear(true);
    },

    // @private
    initValue: function() {
        if (this.value !== undefined) {
            this.setValue(this.value, true);
        }

        /**
         * The original value of the field as configured in the {@link #value} configuration, or
         * as loaded by the last form load operation if the form's {@link Ext.form.BasicForm#trackResetOnLoad trackResetOnLoad}
         * setting is <code>true</code>.
         * @type mixed
         * @property originalValue
         */
        this.originalValue = this.getValue();
    },

    /**
     * <p>Returns true if the value of this Field has been changed from its original value.
     * Will return false if the field is disabled or has not been rendered yet.</p>
     * <p>Note that if the owning {@link Ext.form.BasicForm form} was configured with
     * {@link Ext.form.BasicForm}.{@link Ext.form.BasicForm#trackResetOnLoad trackResetOnLoad}
     * then the <i>original value</i> is updated when the values are loaded by
     * {@link Ext.form.BasicForm}.{@link Ext.form.BasicForm#setValues setValues}.</p>
     * @return {Boolean} True if this field has been changed from its original value (and
     * is not disabled), false otherwise.
     */
    isDirty: function() {
        if (this.disabled || !this.rendered) {
            return false;
        }
        return String(this.getValue()) !== String(this.originalValue);
    },
    
    onClearTap: function() {
        if (!this.disabled) {
            this.setValue('');
        }
    },
    
    checkClear: function(force){
        var clearEl = this.clearEl,
            fieldEl = this.fieldEl,
            value = this.getValue();

        if (!(clearEl && fieldEl)) {
            return;
        }

        value = Ext.isEmpty(value) ? '': String(value);

        if (force || value.length === 0){
            clearEl.addCls('x-hidden-visibility');
            fieldEl.removeCls('x-field-clearable');
        }
        else{
            clearEl.removeCls('x-hidden-visibility');
            fieldEl.addCls('x-field-clearable');
        }
          
    },

    // @private
    afterRender: function() {
        Ext.form.Field.superclass.afterRender.call(this);
        this.initValue();
        this.checkClear();
    },

    onKeyUp: function(e) {
        this.checkClear();
        this.fireEvent('keyup', this, e);
    },

    onMaskTap: function(e) {
        if (this.disabled) {
            return;
        }

        if (this.mask) {
            this.hideMask();
            this.maskCorrectionTimer = Ext.defer(this.showMask, 1000, this);
        }
    },

    showMask: function(e) {
        if (this.mask) {
            this.mask.setStyle('display', 'block');
        }
    },

    hideMask: function(e) {
        if (this.mask) {
            this.mask.setStyle('display', 'none');
        }
    },
    
    /**
     * Resets the current field value to the originally loaded value and clears any validation messages.
     * See {@link Ext.form.BasicForm}.{@link Ext.form.BasicForm#trackResetOnLoad trackResetOnLoad}
     */
    reset: function() {
        this.setValue(this.originalValue);
    },

    // @private
    onBeforeFocus: function(e) {
        this.fireEvent('beforefocus', e);
    },

    beforeFocus: Ext.emptyFn,
    
    // @private
    onFocus: function(e) {
        if (this.mask) {
            if (this.maskCorrectionTimer) {
                clearTimeout(this.maskCorrectionTimer);
            }

            this.hideMask();
        }
        
        this.beforeFocus();
        
        if (this.focusCls) {
            this.el.addCls(this.focusCls);
        }

        if (!this.isFocused) {
            this.isFocused = true;
            /**
             * <p>The value that the Field had at the time it was last focused. This is the value that is passed
             * to the {@link #change} event which is fired if the value has been changed when the Field is blurred.</p>
             * <p><b>This will be undefined until the Field has been visited.</b> Compare {@link #originalValue}.</p>
             * @type mixed
             * @property startValue
             */
            this.startValue = this.getValue();
            this.fireEvent('focus', e);
        }
        
    },

    // @private
    beforeBlur: Ext.emptyFn,

    // @private
    onBlur: function(e) {
        this.beforeBlur();

        if (this.focusCls) {
            this.el.removeCls(this.focusCls);
        }

        this.isFocused = false;

        var v = this.getValue();

        if (String(v) != String(this.startValue)){
            this.fireEvent('change', this, v, this.startValue);
        }

        this.fireEvent('blur', e);
        this.checkClear();
        this.showMask();
        this.postBlur();
    },

    // @private
    postBlur: Ext.emptyFn,

    /**
     * Returns the normalized data value (undefined or emptyText will be returned as '').  To return the raw value see {@link #getRawValue}.
     * @return {Mixed} value The field value
     */
    getValue: function(){
        if (!this.rendered || !this.fieldEl) {
            return this.value;
        }
        return this.fieldEl.getValue();
    },
    
    /**
     * Attempts to set the field as the active input focus.
     * @return {Ext.form.Field} this
     */
    focus: function(){
        if (this.rendered && this.fieldEl && this.fieldEl.dom.focus) {
            this.fieldEl.dom.focus();
        }
         
        return this;
    },
    
    /**
     * Attempts to forcefully blur input focus for the field.
     * @return {Ext.form.Field} this
     */
    blur: function(){
        if(this.rendered && this.fieldEl && this.fieldEl.dom.blur) {
            this.fieldEl.dom.blur();
        }
        return this;
    },

    /**
     * Sets a data value into the field and validates it.  To set the value directly without validation see {@link #setRawValue}.
     * @param {Mixed} value The value to set
     * @return {Ext.form.Field} this
     */
    setValue: function(v){
        this.value = v;

        if (this.rendered && this.fieldEl) {
            this.fieldEl.dom.value = (Ext.isEmpty(v) ? '': v);
        }

        this.checkClear();
        
        return this;
    }
});

Ext.reg('field', Ext.form.Field);
