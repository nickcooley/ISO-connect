Ext.ns('isobar', 'isobar.Master', 'isobar.TopToolBar', 'isobar.BottomToolBar', 'iso.Util');

isobar.Master = Ext.extend(Ext.Panel, {
    layout: 'card',
    fullscreen: true,
    listeners: {
      beforecardswitch: function(el, newCard, oldCard, idx){
       
        if(el.channelList == oldCard ){
          el.backButton.show();
          el.refreshBut.show();
          el.infoBut.hide();
          
        }
        else if(el.channelList == newCard){
          el.backButton.hide();
          el.refreshBut.hide();
          el.infoBut.show();
        }
        
      },
      scope: this
    },

    initComponent: function () {
        
        this.backButton = new Ext.Button({
            ui: 'back',
            text: 'Back',
            hidden: true,
            handler: this.setBack,
            scope: this
        });
        
        this.refreshBut = new Ext.Button({
            iconMask: true,
            ui: 'plain',
            iconCls: 'refresh',
            hidden: true,
            handler: function () {
                this.getActiveItem().updateChannel();
            },scope: this
        });

        this.navigationBut = new Ext.Button({
            hidden: Ext.isPhone,
            text: 'Channels',
            handler: this.onNavButtonTap,
            scope: this
        });
        
        
        this.settingsBut = new Ext.Button(
          {
              hidden: false,
              iconMask: true, 
              ui: 'plain',
              iconCls: 'settings',
              handler: function(){
                  var attendee = (localStorage.getItem('isoAddedToAttendees'))?true:false;
                  if(!this.settingsPopup){
                    this.addtoList = new Ext.Panel({
                      margin: '30px 0 5px',
                      hidden: attendee,
                      items: [{
                        xtype: 'component',
                        html: 'Would you like to be identified as a conference attendee?',
                        margin: '0 0 10px'
                      },{
                        xtype: 'button',
                        text: 'add me to SenchaCon',
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
                          
                        }
                      }]
                    })
                    
                    this.settingsPopup = new Ext.Panel({
                      floating: true,
                      modal: true, 
                      centered: true, 
                      width: 300, 
                      height:375,
                      styleHtmlContent: true,
                      items: [
                        {
                          xtype: 'panel', 
                          html: "<p>Looks like you're logged into Twitter.  Click below to log out... </p>",    
                          margin: '0 0 10px'
                        },
                        {
                          xtype: 'button',
                          text: 'Log out of Twitter',
                          handler: function(){
                            window.open('/twitoauth/clearsessions.php', "_self");
                          }
                        },
                        this.addtoList
                      ],
                      dockedItems: [{
                          dock: 'top',
                          xtype: 'toolbar',
                          title: 'ISO|connect Settings'
                      }, 
                      {
                          xtype: 'panel',
                          dock:'bottom',
                          flex:3,
                          styleHtmlContent: true,
                          layout: {
                            packed: 'center',
                            margin: '0 150px 0 150px'
                          },
                          html: '<div class="disclosure"><a href="http://na.isobar.com/isobar-privacy-policy-isoconnect/" target="_new">Privacy Policy</a></div>'
                        
                        }                                                        
                      ],
                      scroll: 'vertical'
                    });
                  
                  }
                this.settingsPopup.show('pop');
                
              }
              
            }
          
        )
        
        this.infoBut = new Ext.Button({
          hidden: false,
          
              iconMask: true, 
              ui: 'plain',
              iconCls: 'info',
              handler: function(){
                if(!this.popup){
                  this.popup = new Ext.Panel({
                    floating: true,
                    modal: true, 
                    centered: true, 
                    width: 300, 
                    height:375,
                    styleHtmlContent: true,
                    html: '<p>ISO|Connect gives you the opportunity to connect with voices that matter and extend your conference experience. </p><p>For questions about ISO|Connect, please contact us at <a href="mailto:events@isobar.com">events@isobar.com</a></p>',
                    //html: ""
                    dockedItems: [{
                        dock: 'top',
                        xtype: 'toolbar',
                        title: 'About ISO|connect'
                    }, 
                    {
                        xtype: 'panel',
                        dock:'bottom',
                        flex:3,
                        styleHtmlContent: true,
                        layout: {
                          packed: 'center',
                          margin: '0 150px 0 150px'
                        },
                        html: '<div class="disclosure"><a href="http://na.isobar.com/isobar-privacy-policy-isoconnect/" target="_new">Privacy Policy</a></div>'
                      
                      }                                                        
                    ],
                    scroll: 'vertical'
                  });
                  
                }
                this.popup.show('pop');
                _gaq.push(['_trackPageview', "/root/infoPage"]); 
                
              }
          
        });
       

        var btns = [];
        if (Ext.is.Phone) {
            btns = [this.backButton,
            {
                xtype: 'spacer'
            },
            this.refreshBut, this.infoBut]
        }
        else {
            btns = [this.navigationBut, 
            {
              xtype: 'spacer'  
            },
            this.infoBut
            ]
        }
        if(localStorage.getItem('oAuth')){
          btns.push(this.settingsBut);
        }
        this.tBar = new Ext.Toolbar({
            dock: 'top',
            cls: 'isoMainToolbar',
            title: 'ISO|connect',
            items: btns
        })

        this.channelList = new iso.channelList({
            hidden: !Ext.is.Phone
        });

        if (!Ext.is.Phone) {
            this.channelList.setWidth(300);
            //this.channelList.setHeight(395);
            this.channelList.setScrollable(false);
            this.channelList.setFloating(true);
            this.channelList.doComponentLayout();
        }

        /* Need to accommodate for allowing the Forrester feed to have unfettered access */
        
        
        this.authorPanel = new iso.channel();
        
        
        var masterItems = [this.authorPanel]
        
        
        
        if (Ext.is.Phone) {
            masterItems.unshift(this.channelList);
        }

        this.items = [masterItems]
        this.dockedItems = [this.tBar];
        this.on('afterrender', this.welcomeUsers,this);
        this.channelList.on('channelSelect', this.channelSelect, this);
        this.authorPanel.on('updateComplete', function () {this.channelList.hide()}, this);
        isobar.Master.superclass.initComponent.call(this);

    },
    welcomeUsers: function(){

      if(!localStorage.getItem('firstTime') || localStorage.getItem('isoDisplayModel')){
        this.welcome = new Ext.Panel({
          floating: true,
          modal: true, 
          centered: true, 
          width: (Ext.is.Phone)?275:450,
          height: (Ext.is.Phone)?350:400, 
          styleHtmlContent: true,
          html:  "<p>ISO|connect helps SenchaCon attendees easily connect and interact with experts and like-minded colleagues to maximize their  conference experience.  With ISO|connect, you can:</p><ul><li>Follow and pinpoint trends relevant to your industry</li><li>Connect with top thinkers around those specific trends</li><li>Share your learnings and key conference takeaways through Twitter</li></ul><p>To get started, just tap away from this window.</p>",
          dockedItems: [{
              dock: 'top',
              xtype: 'toolbar',
              title: (Ext.is.Phone)?'Welcome!':"Welcome to ISO|connect!"
          }],
          scroll: 'vertical'
        });
      this.welcome.show('pop');
      localStorage.setItem('firstTime',true)  
      }
                
      
    },
    onNavButtonTap: function () {
        this.channelList.showBy(this.navigationBut, 'fade');
    },
    setBack: function () {
        var aI = this.getActiveItem(),
            saI = aI.getActiveItem(),
            backAnim = {
                type: 'slide',
                reverse: true
            }
            //currIdx = aI.items.indexOf(saI);
            if (aI == this.channelList) {
                
            }
            else if (aI.isXType("tabpanel")) {
                var ssaI = saI.getActiveItem(),
                    currIdx = saI.items.indexOf(ssaI);
                newIdx = currIdx - 1;
                

                saI.setActiveItem((newIdx >= 0) ? newIdx : 0, backAnim);
                if (newIdx == -1) {
                    this.setActiveItem(0, backAnim);
                }

            }
            else {
                this.setActiveItem(0, backAnim);
            }

            


    },
    refresh: function () {
        this.getActiveItem().fireEvent('refresher');
        
    },
    channelSelect: function (cid) {
        if(!Ext.is.Phone){
          this.channelList.hide();
        }
        if(cid == undefined){
          cid = 0;
        }
        if (typeof cid == 'object') {
            var obj = cid,
                cid = obj.cid,
                name = obj.name,
                shortN = obj.shortN
        }

        this.authorPanel.updateChannel(cid);
        if (Ext.is.Phone) {
            this.tBar.setTitle(shortN);
            this.authorPanel.on('updateComplete', function () {
                this.setActiveItem(1, 'slide')
            }, this);
        }
        else {                        
              this.authorPanel.tTweetsBar.setTitle(name);                        
        }
    }

});


iso.Util = {
  openUrl: function(url) {                
      
      Ext.Msg.confirm('Leaving Site', "This link will open in an external browser window. Would you like to continue?", 
          function(button) {
             if(button == "yes"){
              
              window.open(url, "_self");                                         
             
             }              
          },this
      );      
  },
  beginOAuth: function() {
        Ext.Msg.confirm('Log into Twitter', "In order to utilize this feature of the application, please authenticate with Twitter. Clicking 'Yes' will take you there and bring you back once you have completed the process.", 
          function(button) {
                
                if(button == "yes"){
                  window.open('/twitoauth/redirect.php', "_self");
                }
          }
      ); 
  }
}

var toString = Object.prototype.toString,
        ua = navigator.userAgent.toLowerCase(),
        check = function(r){
            return r.test(ua);
        },
        DOC = document,
        docMode = DOC.documentMode,
        isStrict = DOC.compatMode == "CSS1Compat",
        isOpera = check(/opera/),
        isChrome = check(/\bchrome\b/),
        isWebKit = check(/webkit/),
        isSafari = !isChrome && check(/safari/),
        isSafari2 = isSafari && check(/applewebkit\/4/), // unique to Safari 2
        isSafari3 = isSafari && check(/version\/3/),
        isSafari4 = isSafari && check(/version\/4/),
        isIE = !isOpera && check(/msie/),
        isIE7 = isIE && (check(/msie 7/) || docMode == 7),
        isIE8 = isIE && (check(/msie 8/) && docMode != 7),
        isIE6 = isIE && !isIE7 && !isIE8,
        isBlackberry = check(/blackberry/),
        isGecko = !isWebKit && check(/gecko/),
        isGecko2 = isGecko && check(/rv:1\.8/),
        isGecko3 = isGecko && check(/rv:1\.9/),
        isBorderBox = isIE && !isStrict,
        isWindows = check(/windows|win32/),
        isMac = check(/macintosh|mac os x/),
        isAir = check(/adobeair/),
        isLinux = check(/linux/),
        isSecure = /^https/i.test(window.location.protocol);


if((Ext.is.Phone && (Ext.is.iOS || Ext.is.Android)) || Ext.is.Tablet || isChrome || isSafari ){
Ext.setup({
    
    tabletStartupScreen: 'lib_fe/img/ipad_loading_screen_portrait.png',
    phoneStartupScreen: 'lib_fe/img/iphone_loading_screen.png',
    icon: (Ext.is.Phone) ? 'lib_fe/img/iphone_icon.png' : "lib_fe/img/iPad_icon.png",
    glossOnIcon: false,
    onReady: function () {

    
      isobar.masterPanel = new isobar.Master();
     
        

    }
});

} 
  else{
      document.location = "unsupportedBrowser.html"
      _gaq.push(['_trackPageview', "/root/wrongbrowser"]);
    }  


