Ext.ns('isobar', 'isobar.Master', 'isobar.TopToolBar', 'isobar.BottomToolBar', 'iso.Util');

isobar.Master = Ext.extend(Ext.Panel, {
    layout: 'card',
    fullscreen: true,
    listeners: {
      beforecardswitch: function(el, newCard, oldCard, idx){
        console.log(this);
        if(el.channelList == oldCard ){
          //this.backButton.show();
          //console.log(idx);
          el.backButton.show();
          el.refreshBut.show();
        }
        else if(el.channelList == newCard){
          el.backButton.hide();
          el.refreshBut.hide();
        }
        
      },
      scope: this
    },

    initComponent: function () {
        //this.enableBubble('refresh');
    /*
    this.tBar= new isobar.TopToolBar();
    this.tBar.on('refresh', this.refresh, this)
    */
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
                //obj.fireEvent('refresh', this);
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
                  if(!this.settingsPopup){
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
                          html: "<p>Looks like you're logged into Twitter.  Click below to log out... </p>"    
                        },
                        {
                          xtype: 'button',
                          text: 'Log out of Twitter',
                          handler: function(){
                            window.open('/twitoauth/clearsessions.php', "_self");
                          }
                        }
                      ],
                      
                      
                      //html: ""
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
        if(localStorage.getItem('oAuth') && !Ext.is.Phone){
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
            this.channelList.setHeight(460);
            this.channelList.setScrollable(false);
            this.channelList.setFloating(true);
            this.channelList.doLayout();
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
          html:  "<p>ISO|connect helps conference attendees easily connect and interact with experts and like-minded colleagues to maximize their  conference experience.  With ISO|connect, you can:</p><ul><li>Follow and pinpoint trends relevant to your industry</li><li>Connect with top thinkers around those specific trends</li><li>Share your learnings and key conference takeaways through Twitter</li></ul><p>To get started, just tap away from this window.</p>",
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
        console.log(this.channelList);
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
                console.log('at home');
            }
            else if (aI.isXType("tabpanel")) {
                var ssaI = saI.getActiveItem(),
                    currIdx = saI.items.indexOf(ssaI);
                newIdx = currIdx - 1;
                console.log(newIdx);

                saI.setCard((newIdx >= 0) ? newIdx : 0, backAnim);
                if (newIdx == -1) {
                    this.setCard(0, backAnim);
                }

            }
            else {
                this.setCard(0, backAnim);
            }

            //currIdx = aI.items.indexOf()


    },
    refresh: function () {
        this.getActiveItem().fireEvent('refresher');
        //console.log(this.getActiveItem().refresher);
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
                this.setCard(1, 'slide')
            }, this);
        }
        else {
                        
              this.authorPanel.tTweetsBar.setTitle(name);
                        
        }
    }

});


iso.Util = {
  openUrl: function(url) {                
      console.log(url)
      Ext.Msg.confirm('Log into Twitter', "This link will open in an external browser window. Would you like to continue?", 
          function() {
             window.open(url, '_self');              
          }
      );      
  },
  beginOAuth: function() {
        Ext.Msg.confirm('Log into Twitter', "In order to utilize this feature of the site, we'll need you to log into Twitter. ", 
          function() {
                window.open('/twitoauth/redirect.php', "_self");
              
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
     
        
        
  /*  
   *     localStorage.removeItem('isoConnectUnlocked');
  localStorage.removeItem('isoDisplayModel');
  localStorage.removeItem('oAuth'); 
 localStorage.removeItem('isoConnectUnlocked');
  localStorage.removeItem('isoDisplayModel');
  localStorage.removeItem('oAuth');      
 localStorage.setItem('isoConnectUnlocked', 'true');
 
 
  localStorage.removeItem('isoConnectUnlocked');
   */

    }
});

} 
  else{
      var d = document.createElement("div");
      d.className = "noWebkitBrowser"
      d.innerHTML = "<img src='/img/placeholder.jpg'/><p>We're sorry, ISO|connect is not available for your browser</p>"
      document.body.appendChild(d);
      _gaq.push(['_trackPageview', "/root/wrongbrowser"]);
    }  


