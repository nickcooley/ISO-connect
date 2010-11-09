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
     
     this.tpl= '<tpl for="."><tpl if="branding==&quot;true&quot;"><div class="branded chItem"></tpl><tpl if="branding==&quot;false&quot;"><div class="chItem"></tpl><div>{name}</div></div></tpl>';
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
  

	
})


/*
Ext.setup({
  onReady: function(){
    var list = new iso.channelList();
    console.log(list);
  }
})
*/


/* 
Ext.setup({
    onReady: function(){

        var store = new Ext.data.JsonStore({
            model: 'category',
            proxy: {
                type: 'ajax',
                url: 'lib/js/categories.js',
                reader: {
                    type: 'json',
                    root: 'categories',
                    idProperty: 'cid'
                }
            },
            autoLoad: true
        });
        
        console.log(store)
        
        var fullList = "";
        var fullList = new Ext.List({
            tpl: '<tpl for="."><li>{name}</li></tpl>',
            itemSelector: 'li',
            singleSelect: true,
            fullscreen: true,
            //title: 'ISOConnect',
            displayField: 'name',
            
            // add a / for folder nodes in title/back button
            getTitleTextTpl: function() {
                return '{' + this.displayField + '}';
            },
            // add a / for folder nodes in the list
            getItemTextTpl: function() {
                return '{' + this.displayField + '}';
            },
            // provide a codebox for each source file
            getDetailCard: function(record, parentRecord) {
              return new Ext.Panel({
                html: '<h1>Here is resulting content</h1>'
              });    
            },
            store: store
        });

        console.log(fullList)
        
        fullList.on('itemtap', function(subList, subIdx, el, e, detailCard) {
             //fullList.backButton.show();           
             var ds = subList.getStore(),
             r  = ds.getAt(subIdx);
             console.log(r.data.cid);
             
             
             
             //fullList.toolbar.setTitle(r.data.title);
             //detailCard.update('<h1 style="color:#fff">new content</h1>');
             
        });
    }
});*/