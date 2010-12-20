Ext.ns('iso', 'iso.views', 'iso.detailedTweet', 'iso.TweetList', 'iso.TweetFlow');


//url regex: /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/    

/* 
 * iso.TweetList = extended List.  Will be child of TweetFlow 
 * 
 * */
iso.TweetList = Ext.extend(Ext.List, {
  title: 'Tweets',
  cls: 'tweetList',
  fullscreen: true,
  unlocked: localStorage.getItem('isoConnectUnlocked'),
  itemSelector: '.tweet',
  singleSelect: true,
  emptyText: 'No tweets matching in this category yet',
  //singleSelect: true,
  ui: 'dark',
  initComponent: function(){
    
    Ext.regModel('Tweet',{fields: ['profile_image_url', 'from_user', 'text', 'created_at']})
    this.store = new Ext.data.JsonStore({model: 'Tweet'});
    this.itemTpl = tweetTpl;
    
      var refreshButton = new Ext.Button({
          iconMask: true,
          iconCls: 'refresh',
          handler: this.updateResults,
          scope: this
        });                    
    
    iso.TweetList.superclass.initComponent.call(this);
    this.addEvents('updateComplete', 'refresher','updateComplete', 'selectTweet');
    this.on('itemtap', this.tweetSelect, this);
    this.on('refresher', this.updateResults, this);
  
  },
  tweetSelect: function(dv, index, item, e){
  	if(localStorage.getItem('oAuth')){
  	  var ds = dv.getStore(),
      r = ds.getAt(index),
      tid = r.get("id");
      
      
      _gaq.push(['_trackPageview', "tweets/selectTweet/" + tid]);
      this.fireEvent('selectTweet', r);
  	}
  	else{
  	  iso.Util.beginOAuth();
  	}
  	
  	
  },
  refresher: function(){
    
    this.updateResults();
  },
  updateResults: function(cid){
    Ext.getBody().mask('Loading', 'loading', false);
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
    
    
    this.itemTpl = tweetTpl;      
    
    var randomnumber=Math.floor(Math.random() * 100000000000);
      
  	Ext.util.JSONP.request({
     url: '/api/get_tweets_by_channel.php', //'/lib/js/sampleTweets.js',//
     params: {
      "cid": cid,
      "wrap": true,
      "chksum": randomnumber
      
     },
     scope: this,
     callbackKey: 'callback',
     callback: function(result){
       
       var tweets = result.tweets;
       if(tweets){
         this.store.loadData(tweets);
         this.fireEvent('updateComplete');
       
       }
       else{
         console.log('sorry, no tweets');
       }
       Ext.getBody().unmask();
       }
    
    });
  }  
});

Ext.ns('isobar.detailedTweet');

   
Ext.regModel('mdlTweet', {
  fields: ['channel_id', 'created_at', 'id', 'text', 'source', 'created_at_long', 'profile_image_url', 'screen_name', 'from_user_id']
})


isobar.detailedTweet = Ext.extend(Ext.Panel, {
  layout: {type: 'vbox', align: 'stretch'},
  cls: 'tweetDetail',
  //fullscreen: true,
  initComponent: function(){
    
    this.storeTweet = new Ext.data.JsonStore({model: 'mdlTweet'})
    
    
    this.pnlTweet = new Ext.Panel({
      flex: 1,
      tpl: tplTweet,
      store: this.storeTweet
    });
    var oAuthed = (localStorage.getItem('oAuth')=="true")?true:false;
    var rt = new Ext.Button({
      text: 'Retweet',
      cls: 'cta',
      hidden: !oAuthed,
      centered: true,
      handler: this.processReTweet,
      scope: this
    });
    var fv = new Ext.Button({
      text: 'Favorite', 
      cls: 'cta', 
      hidden: !oAuthed,
      centered: true,
      handler: this.processFavorite, 
      scope: this
    })
    var cta = new Ext.Button({
      text: 'Share',
      cls: 'cta',
      hidden: oAuthed,
      centered: true,
      handler: function(){
        /* TODO clean up structure of Tweet Detail to get actual modeled info in here */
        /* 
        var oldState = Ext.util.JSON.encode(this.storeTweet);
        localStorage.setItem('isoPreviousTweetDetail', oldState);
        console.log(oldState);
        */
        
        iso.Util.beginOAuth();
      },
      scope: this
    });
    
    this.pnlTwAuthorDe = new Ext.Panel({
      cls: '',
      tpl: tplTweetAuthor,
      flex:3,
      store: this.storeTweet
    })
    
    var authorItems = [this.pnlTwAuthorDe, {
        xtype: 'button',ui: (Ext.is.Phone)?'small':null, text:'Details', flex: 1, handler: this.getAuthorDetail, scope: this, layout: {align:'right'}
      }];
    this.tweetAuthorInfo = new Ext.Panel({
      cls: 'authorDetails',
      layout: {type: 'hbox', height: '100', pack: 'justify'},
      dock: 'bottom',
      items: authorItems
    });
    
    this.buttonArea = new Ext.Panel({
      align: 'center',
      layout: {type: 'hbox', width: 'auto'},
      padding: '10px',
      items: [rt, cta, fv]
    })
    
    var itemsArray = [this.pnlTweet, this.buttonArea];
    
    this.items = itemsArray;
    this.dockedItems = [this.tweetAuthorInfo]
    
    isobar.detailedTweet.superclass.initComponent.call(this);
    this.addEvents('updateComplete', 'needAuthor');
  },
  processFavorite: function(){
    Ext.Msg.confirm('Favorite Tweet?', 'Are you sure you want to add this tweet to your favorites?', function(button){
      if(button == 'yes'){
           var ds = this.storeTweet,
            r = ds.getAt(0);
            r = r.get('id');
            
            Ext.util.JSONP.request({
             url: '/api/favorite.php',
             params: {
              "tid": r,
              "wrap": true
              
             },
             scope: this,
             callbackKey: 'callback',
             callback: function(result){
               
               if(result.success == true){
                 _gaq.push(['_trackPageview', "tweets/favorite/" + r]);
                 var title = "Favorite Success!"
                 var msg = "You have successfully added this tweet to your favorites." 
               }
               else{
                 var title = "Favorite Error"
                 var msg = "There was a problem with your this operation.  Please try again later." 
               }
               
               Ext.Msg.alert(title, msg);                      
             }
             });           
      }           
    },this)    
  },
  processReTweet:function(){
    Ext.Msg.confirm('Retweet?', 'Are you sure you want to retweet this item?', function(button){      
      if(button == 'yes'){
        var ds = this.storeTweet,
        r = ds.getAt(0);
        r = r.get('id');     
        
        
        
        Ext.util.JSONP.request({
         url: '/api/retweet.php',
         params: {
          "tid": r,
          "wrap": true
          
         },
         scope: this,
         callbackKey: 'callback',
         callback: function(result){
           
           if(result.success == true){
             _gaq.push(['_trackPageview', "tweets/retweet/" + r]);
             var title = "Retweet Success!"
             var msg = "You have successfully retweeted this item." 
           }
           else{
             var title = "Retweet Error"
             var msg = "There was a problem with your retweet.  Please try again later." 
           }
           
           Ext.Msg.alert(title, msg);
                  
         }
         });
       }
      
    }, this)
    
    
    
  },
  getAuthorDetail: function(){
   var ds = this.storeTweet;
   
   r = ds.getAt(0);
   r = r.get('screen_name');
   
   
   this.fireEvent('needAuthor',r);
  },
  updateTwDetail: function(record){
    var r = record.data
    
    
    if(r.parsed == undefined){
      r.text = this.handleLinks(r.text);
      r.source = this.reEncodeLinks(r.source);
      r.parsed = true;    
    }
    
    this.storeTweet.removeAt(0);
    this.storeTweet.add([record.data]);
    this.pnlTweet.update(record.data);
    this.pnlTwAuthorDe.update(record.data);
   
    //this.pnlTwAuthorDe.doLayout();
    this.fireEvent('updateComplete');
    
  },
  reEncodeLinks: function(text){
     text = text.replace(/&gt;/gi, '>');
     text = text.replace(/&lt;/gi, '<');
     text = text.replace(/&quot;/gi, '"');
     return text;
  },
  handleLinks: function(text){
  	
        var comps = text.split(' ');
        var regEx = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        
        for(i=0; i<comps.length; i++){
        	if(regEx.test(comps[i]) && comps[i].indexOf("<a href='") == -1){
            comps[i] = makeLink(comps[i]);
          }
        }        
        return comps.join(' ');
        function makeLink(link){
          return ("<a href='" + link + "' target='_new'>" + link + "</a>");
        }
      }  
});


iso.TweetFlow = Ext.extend(Ext.Panel, {
  fullscreen: true, 
  layout: 'card', 
  activeItem: 0, 
  title: (Ext.is.Phone)?'Tweets':'Forrester',
  initComponent: function(){
    this.tweetList = new iso.TweetList();
    
    this.detailedTweet = new isobar.detailedTweet({
       style: {
          //padding: '10px 10px 10px 10px'
        }
    });
    this.authorDetail = new iso.authorDetail();
    
    var itemsAr = [this.tweetList]
    
    if(Ext.is.Phone){
      itemsAr.push(this.detailedTweet, this.authorDetail);
      	
    }
    else{
      this.detailPanel = new Ext.Panel({
        layout: 'card',
        items: [this.detailedTweet, this.authorDetail]
      });
      
      this.detailSheet = new Ext.Sheet({
      	cls: 'detailSheet',
      	layout: 'fit',
      	hidden: true,
      	modal: true,
      	centered: false,
      	hideOnMaskTap: true, 
      	data: null, 
      	enter: 'right',
      	exit: 'right',
      	width: 400,
      	style: {
      	 background: '#fff',
      	 padding: 0
      	},
      	listeners: {
      	 hide: function(){
      	   this.detailPanel.setActiveItem(0); 
      	 },
      	 scope: this
      	},
      	renderTo: this.body,
      	stretchY: true,
        items: [this.detailPanel]
      });
    	
    }
    
    this.detailedTweet.on('updateComplete', function(){
      if(Ext.is.Phone){
        this.setActiveItem(1, 'slide');
      }
      else{
        this.detailSheet.show();
      }
    
    }, this);
   
    this.items = itemsAr;
    
    //this.setActiveItem(1);
    
    iso.TweetFlow.superclass.initComponent.call(this);
    this.addEvents('updateComplete')
    this.tweetList.on('updateComplete', this.updateComplete,this)
    this.tweetList.on('selectTweet', this.detailTweet, this);
    this.detailedTweet.on('needAuthor', this.giveAuthor, this);
  },
  giveAuthor: function(id){    
    this.authorDetail.updateAuthor(id);
    this.authorDetail.on('updateComplete', function(){
      
    if(Ext.is.Phone){  
      this.setActiveItem(2, 'slide')
    }
    else{
      this.detailPanel.setActiveItem(1, 'slide');
    }
    
    }, this);
    
  },
  detailTweet: function(record){
    this.detailedTweet.updateTwDetail(record);
  },
  updateTweet: function(dv, index, item, e){
    
  },
  updateComplete: function(){
    this.fireEvent('updateComplete');
  },
  updateResults: function(cid){  
    this.tweetList.updateResults(cid);
  }
});


