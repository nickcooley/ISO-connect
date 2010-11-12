drib.views.ShotDetail = Ext.extend(Ext.Carousel, {
    width: 450,
    height: 550,
    floating: true,
    modal: true,
    styleHtmlContent: true,
    
    setRecord: function(data) {
        this.removeAll();
        
        var dt = new Date(data.created_at);
        this.playerName = data.player.name;
        
        this.add(new Ext.Panel({
            html: [
                '<img src = "' + data.image_url + '"/>',
                '<div class="title">' + data.title + '</div>',
                '<div class="name">by ' + this.playerName + '</div>',
                '<div class="date">Created on ' + dt.format('M d, Y') + '</div>',
                '<div class="views">Views Count: ' + data.views_count + '</div>',
                '<div class="likes">Likes Count: ' + data.likes_count + ' </div>'
            ].join('')
        }));
        
        drib.JSON.request({
            url: 'http://api.dribbble.com/players/' + data.player.id + '/following',
            scope: this,
            callback: this.displayFollowers
        });
    },
    
    displayFollowers: function(response) {
        var html = '<h2>Followers of ' + this.playerName + '</h2>';
        
        var players = response.players;
        var i, ln = players.length;
        for (i = 0; i < ln; i++) {
            html += '<div class="followers-list">';
            html += '<img src = "' + players[i].avatar_url + '" class="avatar" />';
            html += '<div class="name">' + players[i].name + '</div>';
            html += '</div>';
        }
        
        this.add(new Ext.Panel({
            scroll: 'vertical',
            html: html
        }));
        this.doLayout();
    }
});