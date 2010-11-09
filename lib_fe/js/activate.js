Ext.ns('iso.activate');

iso.activate = Ext.extend(Ext.Panel, {
  scroll: false, 
  cls: 'pnlActivate',
  layout: 'vbox',
  fullscreen: true,
  initComponent: function(){
    
  	if(sessionStorage){
  	   sessionStorage.setItem('isoConnectUnlocked',true);
  	}
  	
  	
  	
  	this.activateButton = new Ext.Button({
  	 text: 'ok, GO!'
  	});
    
  	this.dialog = new Ext.Panel({
  	 scroll: false, 
  	 cls: 'formPanel',
  	 defaults: {
  	   xtype: 'panel',
  	   flex: 1,
  	   layout: {align: 'center'}
  	 },
  	 items: [
  	   {
  	     xtype: 'panel',
  	     layout: 'auto',
  	     flex: '1',
  	     html: 'You have unlocked all industry channels!'
  	   },
  	   this.activateButton
  	 ]
  	})
  	
  	
    this.items = [{
      xtype: 'panel',
      html: 'Success!'
    },this.dialog]
   
    
    iso.activate.superclass.initComponent.call(this);
  }

});


Ext.setup({
  onReady: function(){
    window.act = new iso.activate();    
  }
  
})