/**
 * @class Ext.form.Radio
 * @extends Ext.form.Checkbox
 * <p>Single radio field.  Same as Checkbox, but provided as a convenience for automatically setting the input type.
 * Radio grouping is handled automatically by the browser if you give each radio in a group the same name.</p>
 * @constructor
 * Creates a new Radio
 * @param {Object} config Configuration options
 * @xtype radiofield
 */
Ext.form.Radio = Ext.extend(Ext.form.Checkbox, {
    inputType: 'radio',
    
    ui: 'radio',
    
    /**
     * @cfg {Boolean} useClearIcon @hide
     */

    /**
     * Returns the selected value if this radio is part of a group (other radio fields with the same name, in the same FormPanel),
     * @return {String}
     */
    getGroupValue: function() {
        var field,
            fields = this.getSameGroupFields();

        for (var i=0; i<fields.length; i++) {
            field = fields[i];

            if (field.isChecked()) {
                return field.getValue();
            }
        }

        return null;
    },

    /**
     * Set the matched radio field's status (that has the same value as the given string) to checked
     * @param {String} value The value of the radio field to check
     * @return {String}
     */
    setGroupValue: function(value) {
        var field,
            fields = this.getSameGroupFields();

        for (var i=0; i<fields.length; i++) {
            field = fields[i];

            if (field.getValue() == value) {
                field.check();
                return;
            }
        }
    }
});

Ext.reg('radiofield', Ext.form.Radio);

//DEPRECATED - remove this in 1.0. See RC1 Release Notes for details
Ext.reg('radio', Ext.form.Radio);