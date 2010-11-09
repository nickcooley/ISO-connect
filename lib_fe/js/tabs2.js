Ext.ns('iso', 'iso.channel', 'iso.channelLocked')


if(Ext.is.Desktop || Ext.is.Tablet){
  iso.channel = Ext.extend(Ext.Panel, ({
    fullscreen: true,
    layout: {type: 'hbox', align: 'stretch'},
    pack: 'justify',
    initComponent: function(){
        
    	  
    	 this.tVoicesBar = new Ext.Toolbar({
          dock: 'top',
          width: '100%',
          cls: 'tbVoices',
          title: 'Top Voices',
          items: [],
          style: {
            left: 0,
            background: '#000'          	
          },
          packed: 'right',
          align: 'stretch'
        });
        this.voices = new iso.authorInfo({
          dock: 'right',
          flex: 2,
          //width: '300',
          fullscreen: false,
          style: {
            borderLeft: '4px solid #000',
            padding: '0',
            margin: '0'
          },
          dockedItems: [this.tVoicesBar],
          listeners: {
            deactivate: function(){
              this.setCard(0);
              this.getActiveItem().setPosition(0,0);
            }
          }
        });
        
        this.tTweetsBar = new Ext.Toolbar({
          dock: 'top',
          width: '100%',
          cls: 'tbTweets',
          title: (Ext.is.Tablet || Ext.is.Desktop)?'Forrester Consumer Forum':'Tweets',
          items: [{
            iconMask: true, 
            ui: 'plain',
            iconCls: 'refresh', 
            handler: function(){this.tweets.tweetList.fireEvent('refresher')},scope: this}],
          style: {
            left: 0,
            background: '#484948'            
          },
          align: 'stretch'
        });
        
        this.tweets = new iso.TweetFlow({
        	flex:3,
          fullscreen: false,
          dock: 'left',
          style: {
            borderRight: '6px solid #484848'
          },
          listeners: {
            deactivate: function(){
              //this.setCard(0);
              //this.getActiveItem().setPosition(0,0);
            }
          },
          dockedItems: [this.tTweetsBar]
        });
        
    this.items = [this.tweets, this.voices];
    this.dockedItems = [];
    
    this.updateChannel(0);
    	
    iso.channel.superclass.initComponent.call(this);
    this.addEvents('updateComplete');
    this.tweets.on('updateComplete', this.updateComplete, this);
    }, 
    updateChannel: function(cid){
        this.tweets.updateResults(cid);
        this.voices.updateVoicesList(cid);
        
        
        console.log('updating voices to ' + cid);
    },
    updateComplete: function(){
        
        console.log('update complete!');
        this.fireEvent('updateComplete');
      }
  }))
}
else{
  iso.channel = Ext.extend(Ext.TabPanel, ({
      activeItem: 0,
      layout: {pack: 'center'},
      fullscreen: true, 
      type: 'dark',
      sortable: false,
      tabBar: {
        layout: {
          pack: 'center'
        }
      },
      listeners: {
      	beforecardswitch: function(){    	 
      		
      	},
        deactivate: function(){
          
          this.setCard(0);
        }
      
      },
      initComponent: function(){
        
        this.voices = new iso.authorInfo({
          listeners: {
            deactivate: function(){
              this.setCard(0);
              this.getActiveItem().setPosition(0,0);
            }
          }
        });
        this.tweets = new iso.TweetFlow({
          listeners: {
            deactivate: function(){
              this.setCard(0);
              this.getActiveItem().setPosition(0,0);
            }
          }      	
        });
        
        this.items = [this.tweets, this.voices];
        //this.updateChannel(8);
        iso.channel.superclass.initComponent.call(this);
        this.addEvents('updateComplete');
        this.tweets.on('updateComplete', this.updateComplete, this);
      }, 
      updateChannel: function(cid){
        this.tweets.updateResults(cid);
        this.voices.updateVoicesList(cid);
        _gaq.push(['_trackPageview', "unlocked/updateChannel/" + cid]);
        console.log('updating voices to ' + cid);
      },
      updateComplete: function(){
        
        console.log('update complete!');
        this.fireEvent('updateComplete');
      }
  })
  );

}

iso.channelLocked = Ext.extend(Ext.Panel, {
  scroll: true,
  cls: 'channel locked',
  layout: 'card',
  fullscreen: true,
  initComponent: function(){
    var obj = this;
  	this.tweets = new iso.TweetList();
    
    this.items = [this.tweets]
  	
  	this.tweets.on('itemtap', function(){
  	  Ext.Msg.confirm('Unlock Channels',"In order to see this tweet, you'll need to unlock the app by entering a valid business email address.  Would you like to unlock now?", this.unlockChannels, this)
  	},this);
  	
    
    this.bottomPan = new Ext.Panel({
      scroll: false,
      dock: 'bottom',
      cls: 'unlockBottomPan',
      style: {
        padding: '20px 40px'
      },
      layout: 'vbox',
      items: [{
        xtype: 'panel',
        align: 'stretch',
        html: '<p>Unlock to view full industry channels and find out who the top voices are in each.</p>',
        style: {
          marginBottom: '20px'
        }
      },{
        xtype: 'button', 
        ui: 'action',
        text: 'Unlock All Channels',
        handler: this.unlockChannels,
        width: '100%',
        scope: this
      }]
    })
  	
    this.dockedItems = [this.bottomPan];
  	//if(!Ext.is.Phone){this.updateChannel(0);}
    iso.channelLocked.superclass.initComponent.call(this);
    this.addEvents('updateComplete', 'beginUnlock');
    this.tweets.on('updateComplete', this.updateComplete, this);
    
  },
  listeners: {
    afterrender: function(){
      
     this.unlockForms = new iso.formScreen({
      hidden: true
      }); 
     this.unlockForms.on('activationInProcess', function(){console.log('act fired'); this.unlockForms.hide()}, this);
      
    }
  },
  unlockChannels: function(){  
    _gaq.push(['_trackPageview', "/unlock/begin"]);  
  	this.unlockForms.show();
  	//this.fireEvent('beginUnlock');  	
  },
  updateChannel: function(cid){
    _gaq.push(['_trackPageview', "locked/updateChannel/" + cid]);
    this.tweets.updateResults(cid);
  },
  updateComplete: function(){
    this.fireEvent('updateComplete');
  }
})
/*


Ext.setup({
  onReady: function(){
    if(localStorage){
       //localStorage.setItem('isoConnectUnlocked',true);
    }
    if(localStorage.getItem('isoConnectUnlocked')){
      var authorPanel = new iso.channel();
    }
    else {
      var lockedPanel = new iso.channelLocked();
    }
  }
})  */