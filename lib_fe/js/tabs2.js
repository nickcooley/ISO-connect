Ext.ns('iso', 'iso.channel', 'iso.channelLocked')



if(Ext.is.Desktop || Ext.is.Tablet){
  iso.channel = Ext.extend(Ext.Panel, ({
    fullscreen: true,
    layout: {type: 'hbox', align: 'stretch'},
    pack: 'justify',
    initComponent: function(){
        var attendee = (localStorage.getItem('isoAddedToAttendees'))?true:false;
        
        this.attendeeButton = new Ext.Button({
    	     hidden: attendee, 
           iconMask: true,
            ui: 'plain',
            iconCls: 'add', 
            handler: function(){
              var addUser = Ext.Msg.prompt('Are you at SenchaCon?', "Would you like to be identified as a conference attendee?  This way, others at the conference can find you on twitter for some good old fashioned networking!", function(button, answer){
                
                if(button=="ok" && answer.length > 0){
                  Ext.Ajax.request({
                    url: '/api/add_attendee.php?screen_name=' + answer,
                    success: function(response, opts){
                      var rjson = Ext.decode(response.responseText),
                      success = rjson.success
                      if(success == true){
                        Ext.Msg.alert('Success', 'Congratulations! You are now added to our list of conference attendees.  Enjoy networking with your colleagues!');
                        localStorage.setItem('isoAddedToAttendees',true);
                        this.attendeeButton.hide();
                      }
                      else{
                        Ext.Msg.alert('Error', 'We\'re sorry.  There was a problem with your submission.  Please try again.');
                      }
                    }
                  })  
                }
                else{
                  return false;
                }
              }, null, false, null, {placeholder: ' twitter screen name '}); 
            }});
    	  
    	 this.tVoicesBar = new Ext.Toolbar({
          dock: 'top',
          width: '100%',
          cls: 'tbVoices',
          title: 'Top Voices',
          items: [
            {xtype: 'spacer'},           
              this.attendeeButton             
          ],
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
              this.setActiveItem(0);
              this.getActiveItem().setPosition(0,0);
            }
          }
        });
        
        this.tTweetsBar = new Ext.Toolbar({
          dock: 'top',
          width: '100%',
          cls: 'tbTweets',
          title: (Ext.is.Tablet || Ext.is.Desktop)?'Sencha Conference 2010':'Tweets',
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
        
    },
    updateComplete: function(){
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
      	deactivate: function(){
          
          this.setActiveItem(0);
        }
      
      },
      initComponent: function(){
        
        this.voices = new iso.authorInfo({
          listeners: {
            deactivate: function(){
              this.setActiveItem(0);
              this.getActiveItem().setPosition(0,0);
            }
          }
        });
        this.tweets = new iso.TweetFlow({
          listeners: {
            deactivate: function(){
              this.setActiveItem(0);
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
        
      },
      updateComplete: function(){
        
        
        this.fireEvent('updateComplete');
      }
  })
  );

}

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