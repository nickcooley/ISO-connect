Ext.ns('isobar', 'isobar.views', 'iso.formScreen', 'iso.regProcess', 'isobar.unlockF', 'isobar.pnScreen');

iso.formScreen = Ext.extend(Ext.Sheet, {
  modal: true,
  cls: 'unlockForm',
  floatable: true,
  centered: true,
  hidden: true,
  hideOnMaskTap: true,
  width: 320,
  height: 400,
  scroll: false,
  listeners: {
    hide: function(){
      this.unlockForm.setCard(0);
      this.unlockForm.ps.form.reset();
    }
  },
  initComponent: function(){
  	
  	this.unlockForm = new iso.regProcess();
  	
  	this.items = [this.unlockForm]
  	
  	this.relayEvents(this.unlockForm, ['activationInProcess']);    
    
    this.unlockForm.on('formDone', function(){console.log('form hiding'); this.hide()},this);
    iso.formScreen.superclass.initComponent.call(this);
  }
})

 var disclosure = new Ext.Panel({
        
        dock:'bottom',
        flex:3,
        styleHtmlContent: true,
        layout: {
          packed: 'center',
          padding: '0 50px'
        },
        html: '<div class="disclosure"><a href="#">Privacy Policy</a></div>'
      
      })

isobar.unlockF  = Ext.extend(Ext.form.FormPanel, {
    scroll: false,
    cls: 'formBase',
    url: '/unlock/unlock_process.php',
    xtype: 'fieldset', 
    width: '100%',
    standardSubmit: false,
    initComponent: function(){
      var obj = this;
      this.unlockChannels = new Ext.Button({
        text: 'Unlock Channels',
        ui: 'normal',
        scope: this
        
      });
      
      
      this.items = [{
       xtype: 'fieldset',
       cls: 'isoFloat',
       defaults: {
          required: true,
          labelAlign: 'left'
        },
       items: [{
        xtype: 'emailfield',
        name: 'email',
        placeHolder: 'you@domain.com'
       }]
       },{
        xtype: 'fieldset',
        cls: 'isoFloat',
        items:[this.unlockChannels]      
        }]
      
      
      isobar.unlockF.superclass.initComponent.call(this);
      this.addEvents('formGo', 'formError', 'formDone');    
    
    
    },
    listeners: {
      beforesubmit: function(form, values, options){
        var enteredEmail = this.getValues("email").email;
        console.log(this.getValues("email").email);
        //Validation goes here
        
        var emailRegEx = /^[^0-9][A-z0-9_]+([.][A-z0-9_]+)*[@][A-z0-9_]+([.][A-z0-9_]+)*[.][A-z]{2,4}$/
        console.log();
        if(!emailRegEx.test(enteredEmail)){
          this.fireEvent('formError', 'Please enter a valid email address');
          return false;
        }
      },
      submit: function(form, result){
        
        if(result.code == 1){
          this.fireEvent('formGo');
          _gaq.push(['_trackPageview', "/unlock/code1"]);
        }
        else if(result.code == 3){
          localStorage.setItem('isoConnectUnlocked',true);
          _gaq.push(['_trackPageview', "/unlock/code3"]);
          this.fireEvent('formDone');
          Ext.Msg.alert('Already Registered ', 'Looks like you\'ve already registered. Click OK', function(){
            window.location.reload();  
          })
          
        }
                                
      },
      exception: function(form, result){
          console.log(result);
          this.fireEvent('formError', result.message); 
          _gaq.push(['_trackPageview', "/unlock/error"]);
      }    
    },
    formGo: function(result){
     
    }
})



  
  isobar.pnScreen = Ext.extend(Ext.Panel, {
    layout: 'vbox',
    align: 'stretch',
    scroll: false,
    initComponent: function(){
      var obj = this;
      this.items = this.items || [];
      this.dockedItems = this.dockedItems || [];
      this.items.push({
        xtype: 'component',
        cls: 'head',
        styleHtmlContent: true,
        html: '<div><p>Please provide a valid business email address to unlock all industry channels.</p></div>'
      });
      
      this.form = new isobar.unlockF({align:'stretch'         
      });
      this.items.push(this.form);
      
      this.form.unlockChannels.on('tap', function(){
        obj.form.submit({
          waitMsg: {message: 'Submitting', cls: 'loading'}
        });      	
      })
      this.form.on('beforeSubmit', this.beforeSubmit, this);
      
      this.errorPanel = new Ext.Panel({
        height: '20', 
        html: '',
        align: 'stretch'
      })
      
      this.items.push(this.errorPanel);
      
     
      
      
      this.dockedItems.push(disclosure);
      
      
      
      this.addEvents('formGo');
      this.form.on('formGo',this.formGos, this);
      this.form.on('formError',this.formError, this);
      this.doLayout();
      this.relayEvents(this.form, ['formDone']);
      
      isobar.pnScreen.superclass.initComponent.call(this);
    },
    beforeSubmit: function(){      
      
    },
    formError: function(msg){
      console.log(this.items.length);      
        this.errorPanel.update('<div class="frmError"><p>' + msg + '</p></div>');      	
    },
    formGos: function(){
      console.log('level2');
      this.fireEvent('formGo',this);
    }
    
  });


iso.regProcess = Ext.extend(Ext.Panel, {
  layout: 'card',
  //fullscreen: true,
  cls: 'reg-wizard',
  scroll: false,
  activeItem: 0,
  width: 300, 
  height: 400,
  initComponent: function(){
    this.ps = new isobar.pnScreen();
    this.pn2 = new Ext.Panel({
      layout: 'vbox',
      scroll: false,
      styleHtmlConent: true,
      defaults: {
             xtype: 'panel',
             flex: 1
          },
          items: [      	  
      	 	{
      	 	 flex:.5,
      	 	 layout: {align: 'center'},
      	   html: '<p class="head">Thank You! <br/> One more step.</p>'
      	  },
      	  {
      	   
      	   cls: 'formPanel',
      	   flex:.75,
      	   items: [{
      	     align: 'stretch',
      	     html: '<p>Please activate all industry channels by clicking on the link in the confirmation email we just sent you.</p>'  
      	   },
      	   {
      	     xtype: 'button',
      	     text: 'Close This Window',
              cls: 'demobtn',
              handler: this.closeSheet,
              scope: this                                  	     
      	   }
      	   ]      	         	   
      	  },
           disclosure     	  
      ]
      
    });
    
    this.items = [this.ps, this.pn2];
    
        
    iso.regProcess.superclass.initComponent.call(this);
    this.addEvents('activationInProcess');
    this.relayEvents(this.ps, ['formDone'])
    
    this.ps.on('formGo', this.formGo2, this);
  },
  closeSheet: function(){
    console.log('trying to close sheet');
    console.log(this);
    this.fireEvent('activationInProcess');
  	
  },
  formGo2: function(){
    console.log(this);
    //document.location = 'http://www.twitter.com';
    
    this.setCard(1, 'slide');
  }
});
  
/* 
 
Ext.setup({
  tabletStartupScreen: 'lib/img/tabletStartScreen.png' ,
  phoneStartupScreen: 'lib/img/phoneStartScreen.png' ,
  icon: 'lib/img/iconMobile.gif',
  glossOnIcon: true,
  onReady: function(){
  	
  window.ps = new iso.regProcess();  
  
  if(!localStorage.getItem("unlocked")){
    localStorage.setItem("unlocked", true);
  }
  
  
  
  }}); */  