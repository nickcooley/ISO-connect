drib.views.App = Ext.extend(Ext.TabPanel, {
    fullscreen: true,
    tabBar: {
        dock  : 'bottom',
        layout: { pack: 'center' }
    },
    initComponent: function() {
        this.debuts = new drib.views.ShotList({
            iconCls: 'favorites',
            title: 'Debuts',
            url: 'http://api.dribbble.com/shots/debuts'
        });

        this.everyone = new drib.views.ShotList({
            iconCls: 'team',
            title: 'Everyone',
            url: 'http://api.dribbble.com/shots/everyone'
        });

        this.items = [this.debuts, this.everyone];

        drib.views.App.superclass.initComponent.call(this);
    }
});