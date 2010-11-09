/**
 * @class Ext.form.PasswordField
 * @extends Ext.form.Field
 * <p>Wraps an HTML5 password field. See {@link Ext.form.FormPanel FormPanel} for example usage.</p>
 * @xtype passwordfield
 */
Ext.form.PasswordField = Ext.extend(Ext.form.Field, {
    maskField: Ext.is.iOS,
//    maskField: false,
    inputType: 'password',
    autoCapitalize : false
});
//
//if (Ext.is.Android) {
//    Ext.override(Ext.form.PasswordField, {
//        inputType: 'text',
//        autoComplete: false,
//        autoCorrect: false,
//
//        onKeyUp : function() {
//            var me = this,
//                fieldValue = me.fieldEl.dom.value,
//                valueLength = fieldValue.length,
//                currentValue = me.value || '';
//
//            if (valueLength > currentValue.length) {
//                me.value = currentValue + fieldValue.slice(-1);
//                me.fieldEl.dom.value = me.replaceChars(currentValue) + fieldValue.slice(-1);
//            }
//            else if (valueLength < currentValue.length) {
//                me.value = currentValue.slice(0, -1);
//                me.fieldEl.dom.value = me.replaceChars(me.value);
//            }
//            else {
//                Ext.form.PasswordField.superclass.onKeyUp.apply(this, arguments);
//                return;
//            }
//
//            if (me.changeCharTimeout) {
//                clearTimeout(me.changeCharTimeout);
//                me.changeCharTimeout = false;
//            }
//
//            me.changeCharTimeout = setTimeout(function() {
//                me.fieldEl.dom.value = me.replaceChars(me.value);
//                me.changeCharTimeout = false;
//            }, 500);
//
//            Ext.form.PasswordField.superclass.onKeyUp.apply(this, arguments);
//        },
//
//        replaceChars : function(value) {
//            var ln = value.length, i, replaced = '';
//            for (i = 0; i < ln; i++) {
//                replaced += '*';
//            }
//            return replaced;
//        },
//
//        /**
//         * Returns the normalized data value (undefined or emptyText will be returned as '').  To return the raw value see {@link #getRawValue}.
//         * @return {Mixed} value The field value
//         */
//        getValue : function() {
//            return this.value;
//        },
//
//        /**
//         * Sets a data value into the field and validates it.  To set the value directly without validation see {@link #setRawValue}.
//         * @param {Mixed} value The value to set
//         * @return {Ext.form.Field} this
//         */
//        setValue : function(v){
//            this.value = v;
//            if (this.rendered && this.fieldEl) {
//                this.fieldEl.dom.value = (Ext.isEmpty(v) ? '' : this.replaceChars(v));
//            }
//            this.checkClear();
//            return this;
//        }
//    });
//}
Ext.reg('passwordfield', Ext.form.PasswordField);