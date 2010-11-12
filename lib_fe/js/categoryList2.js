Ext.ns('iso.channelList');

Ext.regModel('category', {
    idProperty: 'cid',
    fields: [
        {name: 'cid', type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'branding', type: 'string'},
        {name: 'shortN', type: 'string'}
    ]
});


iso.channelList = Ext.extend(Ext.List, {
  itemSelector: 'div.chItem',
  scroll: true,
  title: 'ISO|Connect',
  cls: 'channelList',
  singleSelect: true,
  clearSelectionOnDeactivate: true,
  displayField: 'name',
  initComponent: function(){
  
  	 
     this.store = new Ext.data.JsonStore({
            model: 'category',
            proxy: {
                type: 'ajax',
                url: 'lib_fe/js/categories.js',//'http://isotwitagg.transitid-dev.com/api/get_channel_list.php', //
                reader: {
                    type: 'json',
                    root: 'categories',
                    idProperty: 'cid'
                }
            },
            autoLoad: true
        });
     
     this.itemTpl= '<tpl for="."><tpl if="branding==&quot;true&quot;"><div class="branded chItem"></tpl><tpl if="branding==&quot;false&quot;"><div class="chItem"></tpl><div>{name}</div></div></tpl>';
     //this.tpl = (this.unlocked)?tweetTpl:tweetTplLocked;
  	
     iso.channelList.superclass.initComponent.call(this);
     this.addEvents('channelSelect','refresher');
     this.on('itemtap', this.selectChannel, this);     
  },
  listeners: {
    single: true
  },
  
  selectChannel: function(dv, index, item, e){
    
    var ds = dv.getStore(),
        r = ds.getAt(index), 
        cid = r.get('cid');
        
        
    _gaq.push(['_trackPageview', "/selectChannel/" + cid]);    
  	this.fireEvent('channelSelect', {'cid':cid, 'name': r.get('name'), 'shortN': r.get('shortN')});
  }
  

	
});
