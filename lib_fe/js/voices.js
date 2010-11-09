Ext.ns('iso.voices', 'iso.authorDetail', 'iso.authorInfo');

var authorAbstract = new Ext.XTemplate([
  '<tpl for=".">',
    '<div class="clearfix authorDetails">',  
      '<img src="{profile_image_url}"/>',
      '<div class="authorDetail">',
        '<h2>{name}</h2><h3>@{screen_name}</h3>',
      '</div></div>',
   '</tpl>']);

var voiceTpl = new Ext.XTemplate([
  '<tpl for=".">',
    '<tpl if="xindex &lt; 11">',
  	'<div class="clearfix ranking li{#}">' ,
    '<div class="clearfix authorDetails">',
      '<img src="{profile_image_url}"/>',
      '<div class="authorDetail">',
        '<h2>{screen_name}</h2>', //<h3>{author_at_name}</h3>',
      '</div>',
      '</div></div></div>',
     '</tpl>',
     '<tpl if="xindex &gt; 10 &amp;&amp; conference_attendee == true">',
     '<div class="clearfix unranked">' ,
     	'<div class="clearfix authorDetails">',
      		'<span class="rank">{#}</span>',
     		'<img src="{profile_image_url}"/>',
      		'<div class="authorDetail">',
       			'<h2>{screen_name}</h2>', //<h3>{author_at_name}</h3>',
      		'</div>',
  		'</div></div></div>',
  		'</tpl>',
   '</tpl>' ]);


var authorDetail = new Ext.XTemplate([
  '<tpl for=".">',
    '<table  class="authorDetails">',
      '<tbody>',
      '<tpl if="location.length != 0">',
      '<tr class="top">',
        '<td colspan="2"><span>Location:</span> {location}</td>',
      '</tr>',
      '</tpl>',
      '<tpl if="description.length != 0">',
      '<tr >',
        '<td colspan="2">',
          '<p>{description}</p>',
        '</td>',
      '</tr>',
      '</tpl>',
      '<tr class="stats">',
        '<td>',
          '<h3>{friends_count}</h3>',
          '<span>following</span>',
        '</td>',
        '<td>',
          '<h3>{followers_count}</h3>',
          '<span>followers</span>',
        '</td>',
      '</tr>',
      '<tr class="stats">',
        '<td>',
          '<h3>{listed_count}</h3>',
          '<span>listed</span>',
        '</td>',
        '<td>',
          '<h3>{statuses_count}</h3>',
          '<span>tweets</span>',
        '</td>',
      '</tr>',
      '<tr class="stats bot">',
        '<tpl if="is_attendee === true">',
        '<td colspan="2" class="attendee">',
        '</tpl>', 
        '<tpl if="is_attendee === false">',
        '<td colspan="2">',
        '</tpl>', 
          'Is ', 
          
          '<tpl if="is_attendee === false">',
          'NOT ',
          '</tpl>',
          'attending the Forrester Consumer Forum',
        '</td>',
      '</tr>',
      '</tbody>',
  '</table>',
  '</tpl>']);   
   
   
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
	tpl: voiceTpl,
	itemSelector: 'div.ranking',
	initComponent: function(){
	   //this.getAuthorData(); 
	   console.log('fire'); 
	   this.store = new Ext.data.JsonStore({model: 'topVoices'});
	   //this.store.sync();
	   //this.updateChannelList(1);
	   
	   iso.voices.superclass.initComponent.call(this);
	   this.on('itemtap', this.onIts, this);
	   
	   
	},
	onIts: function(){
		console.log('tapped');
	}, 
	updateVoicesList: function(cid){
	  console.log('cid is ' + cid); 
		
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
          console.log('updating voices to ' + cid);
          var voices = result.users;
          //console.log(voices);
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
  listeners: {
    afterrender: function(){
      console.log('rendered');
    },
    afterlayout: function(){
      console.log('layouted');
    
    },
    beforeActivate: function(){
      console.log('beforeActivate');
    
    },
    beforeShow: function(){
      //this.doLayout();
    
    }
  
  },
  initComponent: function(){
  	var obj = this;
  	
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
  	   padding: '0 20'
  	   
  	});
  	
  	
  	var twitterButton = new Ext.Button({
  	 width: '95%',
  	 text: 'View on Twitter',
  	 margin: '20 0 40 0',
  	 handler: function(){
         	   
  	   var twitterUrl = "http://www.twitter.com/" + this.user;
  	   console.log(twitterUrl);
  	   //window.open();
  	   iso.Util.openUrl(twitterUrl, "var");
  	     
  	   
  	   //obj.doLayout();
  	 },
  	 scope: this
  	})
  	
  	this.dockedItems = [this.tweetAuthorInfo];
  	
  	var itemsArray = [this.detTable]
  	if(!localStorage.getItem('isoDisplayModel')){
  	 itemsArray.push(twitterButton);
  		
  	}
  	
  	this.items = [itemsArray];
  	
    iso.authorDetail.superclass.initComponent.call(this);
    this.addEvents('updateComplete')
  },
  updateAuthor: function(id){
  	var obj = this;
  	console.log(id);
  	
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
       //console.log(result);
       if(data){
         //obj.update(tweetTpl.applyTemplate(tweets));
         //tweets = [tweets];
        this.user = data.screen_name;
        this.tweetAuthorInfo.update(authorAbstract.applyTemplate(data));
        this.detTable.update(authorDetail.applyTemplate(data));
       	this.fireEvent('updateComplete');
        _gaq.push(['_trackPageview', "/voices/detail/"+ this.user]); 
         //this.scroller.scrollTo({x:0, y:0}, true);
         
       }
       else{
         console.log('sorry, no tweets');
       }
       //this.detTable.doLayout();
     }
   });
  	
  	
  	//console.log(record);
  	//var data = record.data;
    //this.tweetAuthorInfo.update(authorAbstract.applyTemplate(data));
    //this.detTable.update(authorDetail.applyTemplate(data));
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
        arrive: 'left',
        depart: 'left',
        width: 400,
        style: {
         background: '#fff',
         padding: 0
        },
        listeners: {
         hide: function(){
           console.log('deactivate')
           if(this.detailPanel != undefined){  
            this.detailPanel.setCard(0); 
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
        this.setCard(1, 'slide');
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
    console.log('updating voices to ' + cid)
    this.al.updateVoicesList(cid);
  },
  updateAuthor: function(dv, index, item, e){
  	//console.log('updated author');
  	//console.log(dv);
    //this.ad()
  	
    var ds = dv.getStore(),
        r = ds.getAt(index);
        
    console.log(r.get('screen_name'));
    //console.log(r.get('followers'));
    this.ad.updateAuthor(r.get('screen_name'));
    
    
  }

});




/*
Ext.setup({
  onReady: function(){
    
    var authorPanel = new iso.authorInfo();
    
  }
})
*/
