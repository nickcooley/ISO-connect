Ext.ns('iso', 'iso.views', 'iso.detailedTweet', 'iso.TweetList', 'iso.TweetFlow');


//url regex: /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/    

/* 
 * iso.TweetList = extended List.  Will be child of TweetFlow 
 * 
 * */
iso.TweetList = Ext.extend(Ext.List, {
  title: 'Tweets',
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
    this.tpl = (this.unlocked)?tweetTpl:tweetTplLocked;
    
       
      
      var refreshButton = new Ext.Button({
          iconMask: true,
          iconCls: 'refresh',
          handler: this.updateResults,
          scope: this
        });                    
    
    //this.dockedItems = [this.toolbar] ;
    iso.TweetList.superclass.initComponent.call(this);
    this.addEvents('updateComplete', 'refresher','updateComplete', 'selectTweet');
    this.on('itemtap', this.tweetSelect, this);
    this.on('refresher', this.updateResults, this);
  
  },
  tweetSelect: function(dv, index, item, e){
  	var ds = dv.getStore(),
  	r = ds.getAt(index),
  	tid = r.get("id");
  	
  	console.log(r);
  	_gaq.push(['_trackPageview', "tweets/selectTweet/" + tid]);
    this.fireEvent('selectTweet', r);
  },
  refresher: function(){
    console.log('list refreshed');
    this.updateResults();
  },
  updateResults: function(cid){
    Ext.getBody().mask(false, '<div class="loading">Loading&hellip;</div>');
     
    if(typeof cid == 'number' ){
      this.cid = cid
    }
    else if(this.cid!= undefined){
      cid = this.cid;      
    }
    else{
      cid = 0;
    }
    
    if(cid == 0 || this.unlocked){
      this.tpl = tweetTpl;      
    }
    else{
      this.tpl = tweetTplLocked;
    }
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
       //console.log(tweets);
       if(tweets){
         this.store.loadData(tweets);
         //this.scroller.scrollTo({x:0, y:0}, true);
         
         this.fireEvent('updateComplete');
       
       }
       else{
         console.log('sorry, no tweets');
       }
       Ext.getBody().unmask();
        //console.log(obj);
        //obj.testData();
       }
    
    });
  }  
});

Ext.ns('isobar.detailedTweet');

   
Ext.regModel('mdlTweet', {
  fields: ['channel_id', 'id', 'text', 'source', 'created_at_long', 'profile_image_url', 'from_user', 'from_user_id']
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
    
    //this.updateTwDetail(27878204600);
    
    var itemsArray = [this.pnlTweet];
    
    if(!localStorage.getItem('isoDisplayModel')){
     itemsArray.push(rt, cta);
      
    }
    this.items = itemsArray;
    this.dockedItems = [this.tweetAuthorInfo]
    
    isobar.detailedTweet.superclass.initComponent.call(this);
    this.addEvents('updateComplete', 'needAuthor');
  },
  processReTweet:function(){
    //console.log(this.storeTweet.data.get(0));
    
    Ext.Msg.confirm('Retweet?', 'Are you sure you want to retweet this item?', function(){
      var ds = this.storeTweet,
      r = ds.getAt(0);
      
      
      
      
      Ext.util.JSONP.request({
       url: '/api/retweet.php',
       params: {
        "tid": r,
        "wrap": true
        
       },
       scope: this,
       callbackKey: 'callback',
       callback: function(result){
         console.log(result)
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
      
    }, this)
    
    
    
  },
  getAuthorDetail: function(){
   var ds = this.storeTweet;
   console.log(ds);
   r = ds.getAt(1);
   
   console.log(r);
   this.fireEvent('needAuthor',r);
  },
  updateTwDetail: function(record){
    console.log(record.data);
    
    var r = record.data
    
    if(r.parsed == undefined){
      r.text = this.handleLinks(r.text);
      r.source = this.reEncodeLinks(r.source);
      r.parsed = true;    
    }
    
    this.storeTweet.loadData(record.data);
    this.pnlTweet.update(record.data);
    this.pnlTwAuthorDe.update(record.data);
   
    this.pnlTwAuthorDe.doLayout();
    this.fireEvent('updateComplete');
    
  },
  reEncodeLinks: function(text){
     console.log(text);
     text = text.replace(/&gt;/gi, '>');
     text = text.replace(/&lt;/gi, '<');
     text = text.replace(/&quot;/gi, '"');
     console.log(text)
     return text;
  },
  handleLinks: function(text){
  	
        var comps = text.split(' ');
        var regEx = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        
        console.log(comps);
        
        for(i=0; i<comps.length; i++){
        	console.log(comps[i] + ' ' + comps[i])
          if(regEx.test(comps[i]) && comps[i].indexOf("<a href='") == -1){
            console.log(comps[i]);
            comps[i] = makeLink(comps[i]);
          }
        }
        
        return comps.join(' ');
        
        //console.log(regExt.test(text));
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
      	arrive: 'right',
      	depart: 'right',
      	width: 400,
      	style: {
      	 background: '#fff',
      	 padding: 0
      	},
      	listeners: {
      	 hide: function(){
      	   console.log('deactivate')
      	   this.detailPanel.setCard(0); 
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
        this.setCard(1, 'slide');
      }
      else{
        this.detailSheet.show();
      }
    
    }, this);
   
    this.items = itemsAr;
    
    //this.setCard(1);
    
    iso.TweetFlow.superclass.initComponent.call(this);
    this.addEvents('updateComplete')
    this.tweetList.on('updateComplete', this.updateComplete,this)
    this.tweetList.on('selectTweet', this.detailTweet, this);
    this.detailedTweet.on('needAuthor', this.giveAuthor, this);
  },
  giveAuthor: function(id){
    console.log('author in question is ' + id);
    this.authorDetail.updateAuthor(id);
    this.authorDetail.on('updateComplete', function(){
      
    if(Ext.is.Phone){  
      this.setCard(2, 'slide')
    }
    else{
      this.detailPanel.setCard(1, 'slide');
    }
    
    }, this);
    
  },
  detailTweet: function(record){
    console.log(record);
    this.detailedTweet.updateTwDetail(record);
    
    
  },
  updateTweet: function(dv, index, item, e){
    
  },
  updateComplete: function(){
    this.fireEvent('updateComplete');
  },
  updateResults: function(cid){
    console.log(cid);
    this.tweetList.updateResults(cid);
  }
});




/*

Ext.setup({
  tabletStartupScreen: 'lib/img/tabletStartScreen.png' ,
  phoneStartupScreen: 'lib/img/phoneStartScreen.png' ,
  icon: 'lib/img/iconMobile.gif',
  glossOnIcon: true,
  onReady: function(){
  
  var tl = new iso.TweetFlow({});  	 	

    
  	
  }
}); */

//Ext.reg('iso.tweetList', isobar.Tweetlist);
