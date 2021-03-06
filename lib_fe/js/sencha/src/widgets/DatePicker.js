/**
 * @class Ext.DatePicker
 * @extends Ext.Picker
 *
 * <p>A date picker component which shows a DatePicker on the screen. This class extends from {@link Ext.Picker} and {@link Ext.Sheet} so it is a popup.</p>
 * <p>This component has no required properties.</p>
 * 
 * <h2>Useful Properties</h2>
 * <ul class="list">
 *   <li>{@link #yearFrom}</li>
 *   <li>{@link #yearTo}</li>
 * </ul>
 * 
 * <h2>Screenshot:</h2>
  * <p><img src="doc_resources/Ext.DatePicker/screenshot.png" /></p>
 * 
 * <h2>Example code:</h2>
 * 
 * <pre><code>
var datePicker = new Ext.DatePicker();
datePicker.show();
 * </code></pre>
 * 
 * <p>you may want to adjust the {@link #yearFrom} and {@link #yearTo} properties:
 * <pre><code>
var datePicker = new Ext.DatePicker({
    yearFrom: 2000,
    yearTo  : 2015
});
datePicker.show();
 * </code></pre>
 * 
 * @constructor
 * Create a new List
 * @param {Object} config The config object
 * @xtype datepicker
 */
Ext.DatePicker = Ext.extend(Ext.Picker, {
    /**
     * @cfg {Number} yearFrom
     * The start year for the date picker.  Defaults to 1980
     */
    yearFrom: 1980,

    /**
     * @cfg {Number} yearTo
     * The last year for the date picker.  Defaults to the current year.
     */
    yearTo: new Date().getFullYear(),

    /**
     * @cfg {String} monthText
     * The label to show for the month column. Defaults to 'Month'.
     */
    monthText: 'Month',

    /**
     * @cfg {String} dayText
     * The label to show for the day column. Defaults to 'Day'.
     */
    dayText: 'Day',

    /**
     * @cfg {String} yearText
     * The label to show for the year column. Defaults to 'Year'.
     */
    yearText: 'Year',
    
    /**
     * @cfg {Object/Date} value
     * Default value for the field and the internal {@link Ext.DatePicker} component. Accepts an object of 'year', 
     * 'month' and 'day' values, all of which should be numbers, or a {@link Date}.
     * 
     * Examples:
     * {year: 1989, day: 1, month: 5} = 1st May 1989. 
     * new Date() = current date
     */
    
    /**
     * @cfg {Array} slotOrder
     * An array of strings that specifies the order of the slots. Defaults to <tt>['month', 'day', 'year']</tt>.
     */
    slotOrder: ['month', 'day', 'year'],

    initComponent: function() {
        var yearsFrom = this.yearFrom,
            yearsTo = this.yearTo,
            years = [],
            days = [],
            months = [],
            ln, tmp, i,
            daysInMonth;

        // swap values if user mixes them up.
        if (yearsFrom > yearsTo) {
            tmp = yearsFrom;
            yearsFrom = yearsTo;
            yearsTo = tmp;
        }

        for (i = yearsFrom; i <= yearsTo; i++) {
            years.push({
                text: i,
                value: i
            });
        }

        daysInMonth = this.getDaysInMonth(1, new Date().getFullYear());

        for (i = 0; i < daysInMonth; i++) {
            days.push({
                text: i + 1,
                value: i + 1
            });
        }

        for (i = 0, ln = Date.monthNames.length; i < ln; i++) {
            months.push({
                text: Date.monthNames[i],
                value: i + 1
            });
        }

        this.slots = [];
        
        this.slotOrder.forEach(function(item){
            this.slots.push(this.createSlot(item, days, months, years));
        }, this);

        Ext.DatePicker.superclass.initComponent.call(this);
    },

    afterRender: function() {
        Ext.DatePicker.superclass.afterRender.apply(this, arguments);
        
        this.setValue(this.value);
    },
    
    createSlot: function(name, days, months, years){
        switch (name) {
            case 'year':
                return {
                    name: 'year',
                    align: 'center',
                    data: years,
                    title: this.useTitles ? this.yearText : false,
                    flex: 3
                };
            case 'month':
                return {
                    name: name,
                    align: 'right',
                    data: months,
                    title: this.useTitles ? this.monthText : false,
                    flex: 4
                };
            case 'day':
                return {
                    name: 'day',
                    align: 'center',
                    data: days,
                    title: this.useTitles ? this.dayText : false,
                    flex: 2
                };
        }
    },

    // @private
    onSlotPick: function(slot, value) {
        var name = slot.name,
            date, daysInMonth, daySlot;

        if (name === "month" || name === "year") {
            daySlot = this.child('[name=day]');
            date = this.getValue();
            daysInMonth = this.getDaysInMonth(date.getMonth()+1, date.getFullYear());
            daySlot.store.clearFilter();
            daySlot.store.filter({
                fn: function(r) {
                    return r.get('extra') === true || r.get('value') <= daysInMonth;
                }
            });
            daySlot.scroller.updateBoundary(true);
        }

        Ext.DatePicker.superclass.onSlotPick.apply(this, arguments);
    },

    /**
     * Gets the current value as a Date object
     * @return {Date} value
     */
    getValue: function() {
        var value = Ext.DatePicker.superclass.getValue.call(this),
            daysInMonth = this.getDaysInMonth(value.month, value.year),
            day = Math.min(value.day, daysInMonth);

        return new Date(value.year, value.month-1, day);
    },

    /**
     * Sets the values of the DatePicker's slots
     * @param {Date/Object} value The value either in a {day:'value', month:'value', year:'value'} format or a Date
     * @param {Boolean} animated True for animation while setting the values
     * @return {Ext.DatePicker} this This DatePicker
     */
    setValue: function(value, animated) {
        if (!Ext.isDate(value) && !Ext.isObject(value)) {
            value = null;
        }

        if (Ext.isDate(value)) {
            this.value = {
                day : value.getDate(),
                year: value.getFullYear(),
                month: value.getMonth() + 1
            };
        } else {
            this.value = value;
        }

        return Ext.DatePicker.superclass.setValue.call(this, this.value, animated);
    },

    // @private
    getDaysInMonth: function(month, year) {
        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return month == 2 && this.isLeapYear(year) ? 29 : daysInMonth[month-1];
    },

    // @private
    isLeapYear: function(year) {
        return !!((year & 3) === 0 && (year % 100 || (year % 400 === 0 && year)));
    }
});

Ext.reg('datepicker', Ext.DatePicker);