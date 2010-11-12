drib.views.ShotList = Ext.extend(Ext.List, {

    itemSelector: '.shot',
    singleSelect: true,
    
    tpl: new Ext.XTemplate([
        '<tpl for=".">',
            '<div class="shot">',
            '<img src ="{image_teaser_url}" class="teaser" />',
            '<img src ="{player.avatar_url}" class="avatar" />',
            '<h1>{title} <span>by {player.name}</span></h1>',
            '</div>',
        '</tpl>'
    ].join(''), {compiled: true}),
    
    initComponent: function() {        
        this.store = new Ext.data.Store({model: 'Shot'});
        
        this.shotDetail = new drib.views.ShotDetail();
        this.shotDetail.hide();
        
        this.toolbar = new Ext.Toolbar({
            title: '<h1>dribbble</h1>',
            dock: 'top'
        });
        
        this.dockedItems = [this.toolbar];

        drib.views.ShotList.superclass.initComponent.call(this);
    },
    
    afterRender: function(){
        this.on('activate', this.onActivate);
        if (this.url) {
            this.makeRequest(this.url);
        }
        drib.views.ShotList.superclass.afterRender.call(this);
    },
    
    onActivate: function() {
        if (!this.url) {
            this.formPanel.show();
        }
        this.toolbar.doLayout();
    },
    
    onSubmit: function(username) {
        this.username = username;
        this.url = 'http://api.dribbble.com/players/' + username + '/shots/following';
        this.makeRequest(this.url);
    },
    
    makeRequest: function(url) {
        drib.JSON.request({
            url: url,
            scope: this,
            callback: function(response) {
                this.store.loadData(response.shots);
                if (this.username) {
                    localStorage.setItem('dribble-username', this.username);
                    this.setUserButton();
                }
            }
        });
    },
    
    onItemTap: function(item, index, e) {
        var currData = this.getRecord(item).data;
        this.shotDetail.setRecord(currData);
        this.shotDetail.show();
        return drib.views.ShotList.superclass.onItemTap.apply(this, arguments);
    }
});