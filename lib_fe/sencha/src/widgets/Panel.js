/**
 * @class Ext.Panel
 * @extends Ext.lib.Panel
 * <p>Panel is a container that has specific functionality and structural components that make
 * it the perfect building block for application-oriented user interfaces.</p>
 * <p>Panels are, by virtue of their inheritance from {@link Ext.Container}, capable
 * of being configured with a {@link Ext.Container#layout layout}, and containing child Components.</p>
 * <p>When either specifying child {@link Ext.Component#items items} of a Panel, or dynamically {@link Ext.Container#add adding} Components
 * to a Panel, remember to consider how you wish the Panel to arrange those child elements, and whether
 * those child elements need to be sized using one of Ext's built-in <code><b>{@link Ext.Container#layout layout}</b></code> schemes. By
 * default, Panels use the {@link Ext.layout.ContainerLayout ContainerLayout} scheme. This simply renders
 * child components, appending them one after the other inside the Container, and <b>does not apply any sizing</b>
 * at all.</p>
 * 
 * <p>Example usage:</p>
 * <pre><code>
var pnl = new Ext.Panel({
    fullscreen: true,
    dockedItems: [{
        dock: 'top',
        xtype: 'toolbar',
        title: 'Standard Titlebar'
    },{
        dock: 'top',
        xtype: 'toolbar',
        type: 'light',
        items: [{
            text: 'Test Button'
        }]
    }],
    html: 'Testing'
});</code></pre>
 * 
 * @constructor
 * Create a new Panel
 * @param {Object} config The config object 
 * @xtype panel
 */
Ext.Panel = Ext.extend(Ext.lib.Panel, {
    // inherited
    scroll: false,

    /**
     * @cfg {Boolean} fullscreen
     * Force the component to take up 100% width and height available. Defaults to false.
     * Setting this configuration immediately sets the monitorOrientation config to true.
     */
    fullscreen: false
});

Ext.reg('panel', Ext.Panel);