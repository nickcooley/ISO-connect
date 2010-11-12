Ext.ns('isobar', 'isobar.views', 'isobar.twAuthScreen');

var formBase2 = {
    scroll: false,
    cls: 'formBase',
    url: 'submit.php',
    xtype: 'fieldset', 
    standardSubmit: false,
    listeners: {
      submit: function(form, result){
        
      },
      exception: function(){
      
      }    
    },
    items: [{
       xtype: 'fieldset',
       cls: 'isoFloat',
       defaults: {
          required: true,
          labelAlign: 'left'
       },
       items: [{
        xtype: 'field',
        name: 'un',
        placeHolder: 'username'
       }]
       },
       {
       xtype: 'fieldset',
       cls: 'isoFloat',
       defaults: {
          required: true,
          labelAlign: 'left'
       },
       items: [{
        xtype: 'passwordfield',
        name: 'pass',
        placeHolder: 'password'
       }]
       },
       {
        xtype: 'fieldset',
        items:[{
          xtype: 'button',
          cls: 'demobtn',
          flex: 1,
          text: 'Unlock Channels',
          ui: 'action',
          handler: function(){
          
          }       
       }]      
    }]    
  };

  isobar.twAuthScreen = Ext.extend(Ext.Panel, {
    layout: {type: 'vbox', align: 'stretch'},
    fullscreen: true,
    initComponent: function(){
      this.items = this.items || [];
      this.items.push({
        xtype: 'component',
        styleHtmlContent: true,
        html: '<p>In order to share (retweet) content, you need to connect this application to your Twitter&reg; account;'
      });
      
      var form = new Ext.form.FormPanel(formBase2);
      this.items.push(form);
      
      this.items.push({
        xtype: 'component',
        styleHtmlContent: true,
        html: '<p>Legalese goes here Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ut nibh ante. Cras ac lacus eget nisi ultrices gravida pretium eu mauris. Praesent feugiat blandit orci id iaculis. Cras sit amet velit eget magna faucibus bibendum quis at nunc. Proin volutpat gravida purus. Proin placerat purus ac eros sodales nec placerat urna lacinia. Morbi lacinia commodo iaculis. Aenean et dui non felis semper adipiscing. Aenean viverra pellentesque diam ut hendrerit. Nunc sollicitudin pellentesque augue, quis semper ante laoreet sit amet.</p>'
      
      });
        
      
      isobar.twAuthScreen.superclass.initComponent.call(this);
    }
  });
  
 
Ext.setup({
  tabletStartupScreen: 'lib/img/tabletStartScreen.png' ,
  phoneStartupScreen: 'lib/img/phoneStartScreen.png' ,
  icon: 'lib/img/iconMobile.gif',
  glossOnIcon: true,
  onReady: function(){
  	
    
  var ps = new isobar.twAuthScreen();
  	
  }}); 