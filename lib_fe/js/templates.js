
//originally from sharing3.js

var tweetTplLocked = new Ext.XTemplate([
    '<tpl for=".">',
      '<tpl if="xindex < 6">',
        '<div class="clearfix tweet">',
            '<img src="{profile_image_url}" />',
            
                '<div class="tweet-bubble">',
                    '<div class="tweet-content">',
                        '<p>{text}</p><strong></strong>',
                        '<h2>@{screen_name} - <span class="posted">{created_at}</span></h2>',                     
                    '</div>',
                    
                '</div>',
            '</div>',
        '</div>',        
    '</tpl>',
    '</tpl>'        
    ]);

var tweetTpl = new Ext.XTemplate(
    
  '<tpl for=".">',
    '<div class="clearfix tweet">',
       '<img src="{profile_image_url}" />',
       
                '<div class="tweet-bubble">',
                    '<div class="tweet-content">',
                        '<p>{text}</p><strong></strong>',
                        '<h2>@{screen_name} - <span class="posted">{created_at}</span></h2>',                        
                    '</div>',                    
                '</div>',
            '</div>',
        '</div>',        
    '</tpl>'
    , {
      compiled: true
      
    });

//from sharing4.js -- for detailedTweet

var tplTweet = new Ext.XTemplate([
  '<tpl for=".">', 
    '<div class="twDetail">',
    '<p class="tweet">{text}</p>', 
    '<p class="sourceInfo">Sent: {created_at_long}</p>',
    '</div>',
  '</tpl>'
]);

var tplTweetAuthor = new Ext.XTemplate([
  '<tpl for=".">',
    '<div class="clearfix authorDetails">',  
      '<img src="{profile_image_url}"/>',
      '<div class="authorDetail">',
        '<h2>@{screen_name}</h2>',
      '</div></div>',
   '</tpl>']);
    
    