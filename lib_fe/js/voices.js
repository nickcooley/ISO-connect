Ext.ns('iso.voices', 'iso.authorDetail', 'iso.authorInfo');

Ext.regModel('topVoices', {
  fields: ['profile_image_url', 'screen_name', 'from_user_id']
	
})
  
Ext.regModel('AuthorList', {
  fields: ['img', /*'author_full_name', */ 'screen_name', 'from_user_id', 'description', 'total_following', 'followers', 'listed', 'tweet_total', 'attending']
	//fields: [{name:'img', type: 'string'},{name: 'author_full_name', type: 'string'},{name:'author_at_name', type: 'string'}]
	
});


iso.voices = Ext.extend(Ext.List, {
  fullscreen: true, 
	model: 'AuthorList',
	cls: 'listAuthors',
	itemTpl: voiceTpl,
	singleSelect: true,
	itemSelector: 'div.ranking',
	initComponent: function(){	   	   
	   this.store = new Ext.data.JsonStore({model: 'topVoices'});	   
	   iso.voices.superclass.initComponent.call(this);		   	   
	},
	updateVoicesList: function(cid){
	  
		this.scroller.scrollTo({x: 0, y: 0});
		if(typeof cid == 'number' ){
      this.cid = cid
    }
    else if(this.cid!= undefined){
      cid = this.cid;      
    }
    else{
      cid = 0;
    }
    
    var randomnumber=Math.floor(Math.random() * 100000000000)
     
	  Ext.util.JSONP.request({	   
      url: '/api/get_voices_by_channel.php', //'lib/js/sampleauthors.js',
      params: {
        "cid": cid,
        "wrap": true,
        "chksum": randomnumber
       },
       scope: this,
       callbackKey: 'callback',
       callback: function(result){
          var voices = result.users;
          
          if(voices){
            this.store.loadData(voices);
            this.fireEvent('updateComplete');
          }
          else{
            console.log('sorry, no tweets');
          }
       }
	  })
	  
		
		
	}
});


iso.authorDetail = Ext.extend(Ext.Panel,{
  layout: 'vbox',
  //fullscreen: true,
  paddingTop: '20',
  scroll: 'vertical',
  initComponent: function(){
  	var obj = this;
  	var oAuthed = (localStorage.getItem('oAuth')=="true")?true:false;
  	this.tweetAuthorInfo = new Ext.Panel({
      layout: {align: 'stretch'},
      cls: 'wrpAuthorDetail',
      ui: 'dark',
      dock: 'top',
      width: '100%',
      height: '80px',
      html: '<div class="loading">Loading</div>'
      })
  	
  	
  	this.detTable = new Ext.Panel({
  	   html: '<div class="loading">Loading</div>',
  	   margin: '10 0 20',
  	   flex: 3,
  	   padding: '0 20'
  	   
  	   
  	});
  	
  	var twitterButton = new Ext.Button({
  	 text: 'View on Twitter',
  	 handler: function(){
       var twitterUrl = "http://www.twitter.com/" + this.user;
  	   
  	   iso.Util.openUrl(twitterUrl, "var");
  	   },
  	 scope: this
  	});
  	
  	this.followButton = new Ext.Button({     
     text: 'Follow user',
     hidden: !oAuthed,
     margin: '0 0 10px 6px',
     handler: this.handleFollow,
     scope: this
    });
  	
  	this.dockedItems = [this.tweetAuthorInfo];
  	var itemsArray = [this.detTable]
  	
  	
  	this.buttonArea = new Ext.Panel({
      layout: {type: 'hbox'},
      flex:.75,
      padding: '10px',
      items: [twitterButton, this.followButton]
    })
  	
  	this.items = [this.buttonArea, itemsArray ];
  	
    iso.authorDetail.superclass.initComponent.call(this);
    this.addEvents('updateComplete')
  },
  handleFollow: function(){
    var user = this.user
    Ext.Msg.confirm('Follow '+ user +'?', 'Are you sure you want to follow this user?', function(button){
      if(button == 'yes'){
        Ext.util.JSONP.request({
          url: '/api/follow.php',
          params: {
            screen_name: user,
            wrap: true
          },
          callbackKey: 'callback',
          callback: function(result){            
            var title, msg;
            if(result.success = true){
              title = "Follow Success!"
              msg = "You are now following " + user
            }
            else{
              title = "Follow Error!";
              msg = "There was an error.  Please try again."
            }
            Ext.Msg.alert(title, msg);
          }
        },this)
        
      }
    },this);
    
    
  },
  updateAuthor: function(id){
  	var obj = this;
  	
  	
  	
  	this.tweetAuthorInfo.update('');
  	this.detTable.update('');
  	
  	Ext.util.JSONP.request({
     url: '/api/get_user_details.php', //'/lib/js/sampleTweets.js',//
     params: {
      "screen_name": id, //cid,
      "wrap": true
      
     },
     scope: this,
     callbackKey: 'callback',
     callback: function(result){
       var data = result.user_details;       
       if(data){
        this.user = data.screen_name;
        this.tweetAuthorInfo.update(authorAbstract.applyTemplate(data));
        this.detTable.update(authorDetail.applyTemplate(data));
       	this.fireEvent('updateComplete');
        
        _gaq.push(['_trackPageview', "/voices/detail/"+ this.user]); 
       }
       else{
         console.log('sorry, no tweets');
       }       
     }
   });
  	
  }

});

iso.authorInfo = Ext.extend(Ext.Panel, {
  fullscreen: true,
  layout: 'card',
  activeItem: 0,
  title: 'Voices',
  initComponent: function(){
    this.al = new iso.voices();    
    this.ad = new iso.authorDetail();
    
    
    var itemsAr = [this.al]
    
    if(Ext.is.Phone){
      itemsAr.push(this.ad);
    }
    else{
      this.detailSheet = new Ext.Sheet({
        cls: 'detailSheet',
        layout: 'fit',
        hidden: true,
        modal: true,
        centered: false,
        hideOnMaskTap: true, 
        data: null, 
        enter: 'left',
        exit: 'left',
        width: 400,
        style: {
         background: '#fff',
         padding: 0
        },
        listeners: {
         hide: function(){
           if(this.detailPanel != undefined){  
            this.detailPanel.setActiveItem(0); 
           }
         },
         scope: this
        },
        renderTo: this.body,
        stretchY: true,
        items: [this.ad]
      });
    }
    
    this.ad.on('updateComplete', function(){
      if(Ext.is.Phone){
        this.setActiveItem(1, 'slide');
      }
      else{
        this.detailSheet.show();
      }
      
    }, this);
    
    this.items = [itemsAr];
    
    this.backButton = new Ext.Button({
      text: 'back',
      ui: 'back',
      handler: this.onBack,
      hidden: false,
      scope: this    	
    });
    
    
    /*
    this.toolB = new Ext.Toolbar({
      ui: 'dark',
      dock: 'top',
      title: 'title',
      items: [this.backButton]
    });
   
    this.dockedItems = [this.toolB];
    */
    iso.authorInfo.superclass.initComponent.call(this);
    this.al.on('itemtap', this.updateAuthor, this);
  },
  updateVoicesList: function(cid){
    this.al.updateVoicesList(cid);
  },
  updateAuthor: function(dv, index, item, e){
  	if(localStorage.getItem('oAuth')){  	
    var ds = dv.getStore(),
        r = ds.getAt(index);
        
    this.ad.updateAuthor(r.get('screen_name'));
    }
    else{
      iso.Util.beginOAuth();
    }
  }
});

