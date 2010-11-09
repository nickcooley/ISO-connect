/**
 * @class Ext.Container
 * @extends Ext.lib.Container
 * <p>Base class for any {@link Ext.BoxComponent} that may contain other Components. Containers handle the
 * basic behavior of containing items, namely adding, inserting and removing items.</p>
 *
 * <p><u><b>Layout</b></u></p>
 * <p>Container classes delegate the rendering of child Components to a layout
 * manager class which must be configured into the Container using the
 * <code><b>{@link #layout}</b></code> configuration property.</p>
 * <p>When either specifying child <code>{@link #items}</code> of a Container,
 * or dynamically {@link #add adding} Components to a Container, remember to
 * consider how you wish the Container to arrange those child elements, and
 * whether those child elements need to be sized using one of Ext's built-in
 * <b><code>{@link #layout}</code></b> schemes. By default, Containers use the
 * {@link Ext.layout.AutoContainerLayout AutoContainerLayout} scheme which only
 * renders child components, appending them one after the other inside the
 * Container, and <b>does not apply any sizing</b> at all.</p>
 * <p>A common mistake is when a developer neglects to specify a
 * <b><code>{@link #layout}</code></b>. If a Container is left to use the default
 * {@link Ext.layout.AutoContainerLayout AutoContainerLayout} scheme, none of its
 * child components will be resized, or changed in any way when the Container
 * is resized.</p>
 * @xtype container
 */
Ext.Container = Ext.extend(Ext.lib.Container, {
    /**
     * @cfg {String/Mixed} animation
     * Animation to be used during transitions of cards. Note this only works when this container has a CardLayout.
     * Any valid value from Ext.anims can be used ('fade', 'slide', 'flip', 'cube', 'pop', 'wipe').
     * Defaults to <tt>null</tt>.
     */
    animation: null,

    // @private
    afterLayout : function(layout) {
        if (this.floating && this.centered) {
            this.setCentered(true, true);
        }

        if (this.scroller) {
            this.scroller.updateBounds();
        }
        Ext.Container.superclass.afterLayout.call(this, layout);
    },

    /**
     * Returns the current activeItem for the layout (only for a card layout)
     * @return {activeItem} activeItem Current active component
     */
    getActiveItem : function() {
        if (this.layout && this.layout.type == 'card') {
            return this.layout.activeItem;
        }
        else {
            return null;
        }
    },

    /**
     * Allows you to set the active card in this container. This
     * method is only available if the container uses a CardLayout.
     * Note that a Carousel and TabPanel both get a CardLayout
     * automatically, so both of those components are able to use this method.
     * @param {Ext.Component/Number/Object} card The card you want to be made active. A number
     * is interpreted as a card index. An object will be converted to a Component using the
     * objects xtype property, then added to the container and made active. Passing a Component
     * will make sure the component is a child of this container, and then make it active.
     * @param {String/Object} animation (optional) The animation used to switch between the cards.
     * This can be an animation type string or an animation configuration object.
     * @return {Ext.Container} this
     */
    setCard : function(card, animation) {
        this.layout.setActiveItem(card, animation);
        return this;
    },

    /**
     * A template method that can be implemented by subclasses of
     * Container. By returning false we can cancel the card switch.
     * @param {Ext.Component} newCard The card that will be switched to
     * @param {Ext.Component} oldCard The card that will be switched from
     * @param {Number} newIndex The Container index position of the selected card
     * @param {Boolean} animated True if this cardswitch will be animated
     * @private
     */
    onBeforeCardSwitch : function(newCard, oldCard, newIndex, animated) {
        return this.fireEvent('beforecardswitch', this, newCard, oldCard, newIndex, animated);
    },

    /**
     * A template method that can be implemented by subclasses of
     * Container. If the card is switched using an animation, this method
     * will be called after the animation has finished.
     * @param {Ext.Component} newCard The card that has been switched to
     * @param {Ext.Component} oldCard The card that has been switched from
     * @param {Number} newIndex The Container index position of the selected card
     * @param {Boolean} animated True if this cardswitch was animated
     * @private
     */
    onCardSwitch : function(newCard, oldCard, newIndex, animated) {
        return this.fireEvent('cardswitch', this, newCard, oldCard, newIndex, animated);
    },

    /**
     * Disable this container by masking out
     */
    disable: function() {
        Ext.Container.superclass.disable.call(this);
        this.el.mask();
    },

    /**
     * Enable this container by removing mask
     */
    enable: function() {
        Ext.Container.superclass.enable.call(this);
        this.el.unmask();
    }
});

Ext.reg('container', Ext.Container);
