Ext.ns('isobar.detailedTweet');

var tplTweet = new Ext.XTemplate([
  '<tpl for=".">', 
    '<p>{text}</p><p>{source} - {created_at_long}</p>'
]);

var tplTweetAuthor = new Ext.XTemplate([
  '<tpl for=".">',
    '<div class="clearfix authorDetails">',  
      '<img src="{profile_image_url}"/>',
      '<div class="authorDetail">',
        '<h2>@{from_user}</h2>',
      '</div></div>',
   '</tpl>']);
   
Ext.regModel('mdlTweet', {
  fields: ['id', 'text', 'source', 'created_at_long', 'profile_image_url', 'from_user', 'from_user_id']
})


isobar.detailedTweet = Ext.extend(Ext.Panel, {
	layout: {type: 'vbox', align: 'stretch', padding: '50'},
	initComponent: function(){
		
		this.storeTweet = new Ext.data.JsonStore({model: 'mdlTweet'})
		this.pnlTweet = new Ext.Panel({
			flex: 1,
			tpl: tplTweet,
			store: this.storeTweet
		});
		var rt = new Ext.Button({
			text: 'Retweet',
			cls: 'cta'
		})
		var cta = new Ext.Button({
			text: 'Share',
			cls: 'cta'
		});
		
		this.pnlTwAuthorDe = new Ext.Panel({
		  cls: '',
		  tpl: tplTweetAuthor,
		  store: this.storeTweet
		})
		this.tweetAuthorInfo = new Ext.Panel({
			cls: 'authorDetails',
			layout: 'hbox',
			dock: 'bottom',
			items: [this.pnlTwAuthorDe, 
			{
				xtype: 'button',text:'Details', handler: this.getAuthorDetail, scope: this, layout: {align:'right'}
			}
			]
		});
		
		//this.updateTwDetail(27878204600);
		
		this.items = [this.pnlTweet, rt, cta];
		this.dockedItems = [this.tweetAuthorInfo]
		
		isobar.detailedTweet.superclass.initComponent.call(this);
		this.addEvents('updateComplete');
	},
	getAuthorDetail: function(){
	 var ds = this.storeTweet;
	 r = ds.getAt(0);
	 
	 console.log(r.get('id'));
	},
	updateTwDetail: function(tid){
		//console.log('tid is ' + tid);
		
		Ext.util.JSONP.request({     
      url: 'http://isotwitagg.transitid-dev.com/api/get_tweet.php', //'lib/js/sampleauthors.js',
      params: {
        "tid": tid, //27878204600,
        "wrap": true
       },
       scope: this,
       callbackKey: 'callback',
       callback: function(result){
          console.log(result.tweets);
          var tweet = result.tweets[0];
          if(tweet){
            this.storeTweet.loadData(result.tweets);
          	console.log(tweet);
          	
          	 this.pnlTweet.update(tweet);
             this.pnlTwAuthorDe.update(tweet);
          	 
             this.pnlTwAuthorDe.doLayout();
             this.fireEvent('updateComplete');
            
          }
          else{
            console.log('sorry, no tweets');
          }
       }
    })
	
	} 

});

/*
Ext.setup({
	onReady: function(){
		var al = new isobar.detailedTweet();
	}

})*/